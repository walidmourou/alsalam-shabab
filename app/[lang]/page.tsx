import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="yc-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft via-background to-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark ring-1 ring-brand/20">
              {dict.hero.badge}
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">
              {dict.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              {dict.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/register`}
                className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {dict.hero.cta}
              </Link>
              <a
                href="#video"
                className="inline-flex items-center rounded-full border border-navy/15 bg-white px-6 py-3 text-base font-semibold text-navy transition hover:border-navy/30"
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation video */}
      <section id="video" className="scroll-mt-24">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              {dict.video.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">
              {dict.video.subtitle}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl bg-navy p-2 shadow-xl shadow-navy/10">
            <video
              className="aspect-video w-full rounded-2xl bg-black"
              controls
              preload="metadata"
              playsInline
              poster="/shabab-poster.jpg"
            >
              <source src="/shabab.mp4" type="video/mp4" />
              {dict.video.unsupported}
            </video>
          </div>

          <p className="mt-4 text-center text-sm text-foreground/55">
            {dict.video.note}
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            {dict.about.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70">
            {dict.about.subtitle}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.about.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 bg-background p-6 transition hover:border-brand/30 hover:shadow-sm"
              >
                <h3 className="text-base font-semibold text-brand-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facts */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            {dict.facts.title}
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.facts.items.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/5 bg-white p-5"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-base font-medium text-navy">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Commitment + CTA */}
      <section className="pb-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-brand-soft p-8 sm:p-10">
            <h2 className="text-xl font-bold text-brand-dark sm:text-2xl">
              {dict.commitment.title}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/75">
              {dict.commitment.text}
            </p>
            <Link
              href={`/${lang}/register`}
              className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              {dict.hero.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
