"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { adminLogin } from "@/lib/actions/admin";
import type { Dictionary } from "@/lib/i18n";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-base text-foreground outline-none transition placeholder:text-foreground/35 focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function AdminLoginForm({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(adminLogin, {
    error: null as string | null,
  });

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 sm:p-9"
    >
      <input type="hidden" name="returnTo" value={pathname} />

      <h2 className="text-xl font-bold text-navy">{dict.admin.loginTitle}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">
        {dict.admin.loginSubtitle}
      </p>

      {state.error ? (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          {dict.admin.invalidCredentials}
        </p>
      ) : null}

      <label className="mt-6 block">
        <span className="block text-sm font-medium text-navy">
          {dict.admin.username}
        </span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          dir="ltr"
          className={inputClass}
        />
      </label>

      <label className="mt-4 block">
        <span className="block text-sm font-medium text-navy">
          {dict.admin.password}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          dir="ltr"
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-navy px-6 py-3 text-base font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? dict.admin.loggingIn : dict.admin.login}
      </button>
    </form>
  );
}
