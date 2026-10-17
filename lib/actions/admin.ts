"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminCookieOptions, verifyCredentials } from "@/lib/auth";

export type AdminLoginState = {
  error: string | null;
};

function safeReturnTo(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return "/";
}

export async function adminLogin(
  _previousState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "invalidCredentials" };
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieOptions());

  redirect(safeReturnTo(formData.get("returnTo")));
}

export async function adminLogout(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);

  redirect(safeReturnTo(formData.get("returnTo")));
}
