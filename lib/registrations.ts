import type { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  TABLE_CHILDREN,
  TABLE_REGISTRATIONS,
  ensureSchema,
  getPool,
  withConnectionRetry,
} from "./db";
import type { Gender, RegistrationInput } from "./validation";

export type RegistrationChild = {
  id: number;
  fullName: string;
  birthDate: string;
  gender: Gender;
};

export type Registration = {
  id: number;
  parentName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
  locale: string;
  regulationsAccepted: boolean;
  attendanceCommitment: boolean;
  createdAt: string;
  children: RegistrationChild[];
};

export type RegistrationStats = {
  registrations: number;
  children: number;
  boys: number;
  girls: number;
};

type RegistrationRow = RowDataPacket & {
  id: number;
  parent_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
  email: string;
  notes: string | null;
  locale: string;
  regulations_accepted: number;
  attendance_commitment: number;
  created_at: string;
};

type ChildRow = RowDataPacket & {
  id: number;
  registration_id: number;
  full_name: string;
  birth_date: string;
  gender: Gender;
};

/** Stores one registration together with all of its children atomically. */
export async function createRegistration(
  input: RegistrationInput
): Promise<number> {
  await ensureSchema();

  return withConnectionRetry(async () => {
    const connection = await getPool().getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO ${TABLE_REGISTRATIONS}
          (parent_name, address, postal_code, city, phone, email, notes, locale,
           regulations_accepted, attendance_commitment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.parentName,
          input.address,
          input.postalCode,
          input.city,
          input.phone,
          input.email,
          input.notes || null,
          input.locale,
          input.regulationsAccepted ? 1 : 0,
          input.attendanceCommitment ? 1 : 0,
        ]
      );

      const registrationId = result.insertId;

      for (const child of input.children) {
        await connection.query(
          `INSERT INTO ${TABLE_CHILDREN}
            (registration_id, full_name, birth_date, gender)
           VALUES (?, ?, ?, ?)`,
          [registrationId, child.fullName, child.birthDate, child.gender]
        );
      }

      await connection.commit();
      return registrationId;
    } catch (error) {
      // Best effort: the connection may already be gone, in which case the
      // server rolls the open transaction back by itself.
      try {
        await connection.rollback();
      } catch {
        // ignore
      }
      throw error;
    } finally {
      connection.release();
    }
  });
}

/** Returns every registration with its children, newest first. */
export async function listRegistrations(): Promise<Registration[]> {
  await ensureSchema();

  return withConnectionRetry(async () => {
    const pool = getPool();

    const [registrationRows] = await pool.query<RegistrationRow[]>(
      `SELECT id, parent_name, address, postal_code, city, phone, email, notes,
              locale, regulations_accepted, attendance_commitment, created_at
         FROM ${TABLE_REGISTRATIONS}
        ORDER BY created_at DESC, id DESC`
    );

    if (registrationRows.length === 0) {
      return [];
    }

    const [childRows] = await pool.query<ChildRow[]>(
      `SELECT id, registration_id, full_name, birth_date, gender
         FROM ${TABLE_CHILDREN}
        ORDER BY registration_id ASC, id ASC`
    );

    const childrenByRegistration = new Map<number, RegistrationChild[]>();
    for (const row of childRows) {
      const list = childrenByRegistration.get(row.registration_id) ?? [];
      list.push({
        id: row.id,
        fullName: row.full_name,
        birthDate: row.birth_date,
        gender: row.gender,
      });
      childrenByRegistration.set(row.registration_id, list);
    }

    return registrationRows.map((row) => ({
      id: row.id,
      parentName: row.parent_name,
      address: row.address,
      postalCode: row.postal_code,
      city: row.city,
      phone: row.phone,
      email: row.email,
      notes: row.notes ?? "",
      locale: row.locale,
      regulationsAccepted: row.regulations_accepted === 1,
      attendanceCommitment: row.attendance_commitment === 1,
      createdAt: row.created_at,
      children: childrenByRegistration.get(row.id) ?? [],
    }));
  });
}

export async function getRegistrationStats(): Promise<RegistrationStats> {
  await ensureSchema();

  return withConnectionRetry(async () => {
    const pool = getPool();

    const [[registrationCount]] = await pool.query<
      (RowDataPacket & { total: number })[]
    >(`SELECT COUNT(*) AS total FROM ${TABLE_REGISTRATIONS}`);

    const [[childCount]] = await pool.query<
      (RowDataPacket & { total: number })[]
    >(`SELECT COUNT(*) AS total FROM ${TABLE_CHILDREN}`);

    const [genderRows] = await pool.query<
      (RowDataPacket & { gender: Gender; total: number })[]
    >(
      `SELECT gender, COUNT(*) AS total FROM ${TABLE_CHILDREN} GROUP BY gender`
    );

    let boys = 0;
    let girls = 0;
    for (const row of genderRows) {
      if (row.gender === "male") boys = row.total;
      if (row.gender === "female") girls = row.total;
    }

    return {
      registrations: registrationCount.total,
      children: childCount.total,
      boys,
      girls,
    };
  });
}
