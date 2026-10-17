import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { organisation, type Dictionary, type Locale } from "@/lib/i18n";

export default function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={organisation[lang].full}
            width={724}
            height={560}
            priority
            className="h-11 w-auto rounded-lg ring-1 ring-black/5"
          />
          <span className="hidden text-sm font-semibold leading-tight text-navy md:block">
            {organisation[lang].full}
          </span>
        </Link>

        <nav className="ms-auto flex items-center gap-1 sm:gap-2">
          <Link
            href={`/${lang}`}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/70 transition hover:bg-black/5 hover:text-foreground"
          >
            {dict.nav.home}
          </Link>
          <Link
            href={`/${lang}/register`}
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            {dict.nav.register}
          </Link>
          <LanguageSwitcher current={lang} label={dict.a11y.switchLanguage} />
        </nav>
      </div>
    </header>
  );
}
