import mysql from "mysql2/promise";

/**
 * All tables created by this project are prefixed with `yc_` (youth course) so
 * that they never collide with the existing tables of the association's other
 * applications that share the same database.
 */
export const TABLE_REGISTRATIONS = "yc_registrations";
export const TABLE_CHILDREN = "yc_children";

type GlobalWithPool = typeof globalThis & {
  __ycPool?: mysql.Pool;
  __ycSchema?: Promise<void>;
};

const globalForDb = globalThis as GlobalWithPool;

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Please check your .env file (see .env.example).`
    );
  }
  return value;
}

export function getPool(): mysql.Pool {
  if (!globalForDb.__ycPool) {
    globalForDb.__ycPool = mysql.createPool({
      host: readEnv("DB_HOST"),
      port: Number(process.env.DB_PORT ?? 3306),
      user: readEnv("DB_USER"),
      password: readEnv("DB_PASSWORD"),
      database: readEnv("DB_NAME"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4_unicode_ci",
      timezone: "Z",
      dateStrings: true,
    });
  }
  return globalForDb.__ycPool;
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS ${TABLE_REGISTRATIONS} (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    parent_name VARCHAR(200) NOT NULL,
    address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(120) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(190) NOT NULL,
    notes TEXT NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'de',
    regulations_accepted TINYINT(1) NOT NULL DEFAULT 0,
    attendance_commitment TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_yc_reg_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS ${TABLE_CHILDREN} (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    registration_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('male','female') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_yc_child_reg (registration_id),
    CONSTRAINT fk_yc_child_registration
      FOREIGN KEY (registration_id) REFERENCES ${TABLE_REGISTRATIONS} (id)
      ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

/**
 * Creates the project tables on first use. Safe to call on every request: the
 * promise is memoised per server process and the DDL is idempotent.
 */
export function ensureSchema(): Promise<void> {
  if (!globalForDb.__ycSchema) {
    globalForDb.__ycSchema = (async () => {
      const connection = await getPool().getConnection();
      try {
        for (const statement of SCHEMA_STATEMENTS) {
          await connection.query(statement);
        }
      } finally {
        connection.release();
      }
    })().catch((error) => {
      // Do not cache a failed attempt; allow the next request to retry.
      globalForDb.__ycSchema = undefined;
      throw error;
    });
  }
  return globalForDb.__ycSchema;
}
