import type { ErrorCode } from "./i18n";

export type Gender = "male" | "female";

export type ChildInput = {
  fullName: string;
  birthDate: string;
  gender: Gender;
};

export type RegistrationInput = {
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
  children: ChildInput[];
};

export type FieldErrors = Record<string, ErrorCode>;
export type ChildErrors = Record<string, ErrorCode>;

export type ValidationResult =
  | { ok: true; data: RegistrationInput }
  | { ok: false; fieldErrors: FieldErrors; childErrors: ChildErrors[] };

export const MAX_CHILDREN = 6;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits plus the characters commonly used in international phone numbers.
const PHONE_RE = /^[+()/\-\s\d]{5,40}$/;

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isChecked(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

function requiredText(
  value: string,
  field: string,
  max: number,
  errors: FieldErrors
): void {
  if (!value) {
    errors[field] = "required";
  } else if (value.length < 2) {
    errors[field] = "tooShort";
  } else if (value.length > max) {
    errors[field] = "tooLong";
  }
}

function normaliseDate(value: string): string | null {
  if (!value) return null;
  // Accept both `YYYY-MM-DD` (native date input) and `DD.MM.YYYY`.
  const dmy = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  let year: number, month: number, day: number;
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (dmy) {
    day = Number(dmy[1]);
    month = Number(dmy[2]);
    year = Number(dmy[3]);
  } else {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function validateRegistration(formData: FormData): ValidationResult {
  const fieldErrors: FieldErrors = {};

  const parentName = text(formData, "parentName");
  const address = text(formData, "address");
  const postalCode = text(formData, "postalCode");
  const city = text(formData, "city");
  const phone = text(formData, "phone");
  const email = text(formData, "email");
  const notes = text(formData, "notes");
  const locale = text(formData, "locale") === "ar" ? "ar" : "de";

  requiredText(parentName, "parentName", 200, fieldErrors);
  requiredText(address, "address", 255, fieldErrors);
  requiredText(city, "city", 120, fieldErrors);
  requiredText(postalCode, "postalCode", 20, fieldErrors);

  if (!phone) {
    fieldErrors.phone = "required";
  } else if (!PHONE_RE.test(phone)) {
    fieldErrors.phone = "tooShort";
  }

  if (!email) {
    fieldErrors.email = "required";
  } else if (email.length > 190) {
    fieldErrors.email = "tooLong";
  } else if (!EMAIL_RE.test(email)) {
    fieldErrors.email = "email";
  }

  if (notes.length > 2000) {
    fieldErrors.notes = "tooLong";
  }

  const rawNames = formData.getAll("child_name");
  const rawBirthDates = formData.getAll("child_birth_date");
  const rawGenders = formData.getAll("child_gender");
  const childCount = Math.max(
    rawNames.length,
    rawBirthDates.length,
    rawGenders.length
  );

  const children: ChildInput[] = [];
  const childErrors: ChildErrors[] = [];

  if (childCount === 0) {
    // No child rows were submitted at all.
    fieldErrors.children = "minOneChild";
  } else if (childCount > MAX_CHILDREN) {
    fieldErrors.children = "tooManyChildren";
  }

  const today = new Date();
  const todayIso = `${today.getUTCFullYear()}-${(today.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getUTCDate().toString().padStart(2, "0")}`;

  for (let index = 0; index < Math.min(childCount, MAX_CHILDREN); index += 1) {
    const errors: ChildErrors = {};
    const fullName = String(rawNames[index] ?? "").trim();
    const birthDateRaw = String(rawBirthDates[index] ?? "").trim();
    const genderRaw = String(rawGenders[index] ?? "").trim();

    requiredText(fullName, "fullName", 200, errors);

    const birthDate = normaliseDate(birthDateRaw);
    if (!birthDateRaw) {
      errors.birthDate = "required";
    } else if (!birthDate) {
      errors.birthDate = "dateInvalid";
    } else if (birthDate > todayIso) {
      errors.birthDate = "dateFuture";
    } else if (birthDate < "1900-01-01") {
      errors.birthDate = "dateInvalid";
    }

    if (genderRaw !== "male" && genderRaw !== "female") {
      errors.gender = "genderInvalid";
    }

    children.push({
      fullName,
      birthDate: birthDate ?? birthDateRaw,
      gender: genderRaw === "female" ? "female" : "male",
    });
    childErrors.push(errors);
  }

  const regulationsAccepted = isChecked(formData, "regulationsAccepted");
  const attendanceCommitment = isChecked(formData, "attendanceCommitment");
  if (!regulationsAccepted) {
    fieldErrors.regulationsAccepted = "consentRequired";
  }
  if (!attendanceCommitment) {
    fieldErrors.attendanceCommitment = "consentRequired";
  }

  const hasChildErrors = childErrors.some(
    (errors) => Object.keys(errors).length > 0
  );

  if (Object.keys(fieldErrors).length > 0 || hasChildErrors) {
    return { ok: false, fieldErrors, childErrors };
  }

  return {
    ok: true,
    data: {
      parentName,
      address,
      postalCode,
      city,
      phone,
      email,
      notes,
      locale,
      regulationsAccepted,
      attendanceCommitment,
      children,
    },
  };
}
