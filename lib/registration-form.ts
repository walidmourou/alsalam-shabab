import type { ChildErrors, FieldErrors } from "./validation";

export type RegistrationFormState = {
  status: "idle" | "error" | "success";
  fieldErrors: FieldErrors;
  childErrors: ChildErrors[];
};

export const initialRegistrationState: RegistrationFormState = {
  status: "idle",
  fieldErrors: {},
  childErrors: [],
};
