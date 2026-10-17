"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  de: "Deutsch",
  ar: "العربية",
};

export default function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  function hrefFor(locale: Locale) {
    return `/${locale}${rest ? `/${rest}` : ""}`;
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-0.5 rounded-full bg-navy-soft p-0.5"
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            className={
              active
                ? "rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-sm"
                : "rounded-full px-3 py-1 text-xs font-medium text-navy/70 transition hover:text-navy"
            }
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
