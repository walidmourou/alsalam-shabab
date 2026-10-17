"use server";

import { createRegistration } from "@/lib/registrations";
import type { RegistrationFormState } from "@/lib/registration-form";
import { validateRegistration } from "@/lib/validation";

export async function submitRegistration(
  _previousState: RegistrationFormState,
  formData: FormData
): Promise<RegistrationFormState> {
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", fieldErrors: {}, childErrors: [] };
  }

  const result = validateRegistration(formData);

  if (!result.ok) {
    return {
      status: "error",
      fieldErrors: result.fieldErrors,
      childErrors: result.childErrors,
    };
  }

  try {
    await createRegistration(result.data);
  } catch (error) {
    console.error("[yc] Failed to store registration:", error);
    return {
      status: "error",
      fieldErrors: { form: "serverError" },
      childErrors: [],
    };
  }

  return { status: "success", fieldErrors: {}, childErrors: [] };
}
