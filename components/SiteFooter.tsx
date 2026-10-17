import Link from "next/link";
import { organisation, type Dictionary, type Locale } from "@/lib/i18n";

export default function SiteFooter({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="border-t border-black/5 bg-navy text-white/85">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-white">
            {organisation[lang].full}
          </p>
          <p className="mt-1 text-sm text-white/60">{organisation[lang].city}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {dict.footer.about}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.contactTitle}
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            {dict.footer.contactText}
          </p>
          <Link
            href={`/${lang}/register`}
            className="mt-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            {dict.nav.register}
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.linksTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <Link href={`/${lang}`} className="transition hover:text-white">
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/register`}
                className="transition hover:text-white"
              >
                {dict.nav.register}
              </Link>
            </li>
            <li>
              <Link
                href={`/${lang}/admin`}
                className="transition hover:text-white"
              >
                {dict.nav.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6">
          {organisation[lang].full} · {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
