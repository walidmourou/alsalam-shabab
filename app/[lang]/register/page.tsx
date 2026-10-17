import Link from "next/link";
import { notFound } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="yc-fade-up bg-gradient-to-b from-brand-soft/60 to-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={`/${lang}`}
          className="text-sm font-medium text-brand-dark transition hover:text-brand"
        >
          ← {dict.nav.home}
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {dict.register.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">
          {dict.register.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-brand/20 bg-brand-soft px-5 py-4">
          <p className="text-sm font-medium text-brand-dark">
            {dict.register.videoHint}
          </p>
          <a
            href={`/${lang}#video`}
            className="text-sm font-semibold text-brand-dark underline decoration-brand/40 underline-offset-4 transition hover:text-brand"
          >
            {dict.register.videoLink}
          </a>
        </div>

        <div className="mt-8">
          <RegisterForm dict={dict} locale={lang} />
        </div>
      </div>
    </div>
  );
}
