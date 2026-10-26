import { adminLogout } from "@/lib/actions/admin";
import { ageFrom, formatDate, formatDateTime } from "@/lib/dates";
import type { Dictionary, Locale } from "@/lib/i18n";
import type {
  Registration,
  RegistrationStats,
} from "@/lib/registrations";

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-dark"
          : "inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
      }
    >
      <span aria-hidden="true">{ok ? "✓" : "✕"}</span>
      {label}
    </span>
  );
}

export default function AdminDashboard({
  lang,
  dict,
  registrations,
  stats,
}: {
  lang: Locale;
  dict: Dictionary;
  registrations: Registration[];
  stats: RegistrationStats;
}) {
  const t = dict.admin;
  const statCards = [
    { label: t.stats.registrations, value: stats.registrations },
    { label: t.stats.children, value: stats.children },
    { label: t.stats.boys, value: stats.boys },
    { label: t.stats.girls, value: stats.girls },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{t.title}</h1>
          <p className="mt-2 text-sm text-foreground/65">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/${lang}/admin/export`}
            download
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
            >
              <path
                d="M8 2v7m0 0 3-3m-3 3L5 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 11.5v1A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-1"
                strokeLinecap="round"
              />
            </svg>
            {t.export}
          </a>
          <form action={adminLogout}>
            <input type="hidden" name="returnTo" value={`/${lang}/admin`} />
            <button
              type="submit"
              className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy/30"
            >
              {t.logout}
            </button>
          </form>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-black/5 bg-white p-5"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {card.label}
            </dt>
            <dd className="mt-1 text-3xl font-bold text-brand-dark">
              {card.value}
            </dd>
          </div>
        ))}
      </dl>

      {registrations.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-foreground/60">
          {t.table.empty}
        </p>
      ) : (
        <ul className="space-y-5">
          {registrations.map((registration) => (
            <li
              key={registration.id}
              className="rounded-3xl border border-black/5 bg-white p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/5 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                    {t.table.parent}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-navy">
                    {registration.parentName}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                    {t.table.submitted}
                  </p>
                  <p className="mt-1 text-sm text-foreground/70" dir="ltr">
                    {formatDateTime(registration.createdAt, lang)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                    {t.table.contact}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/80" dir="ltr">
                    <a
                      className="hover:text-brand"
                      href={`tel:${registration.phone}`}
                    >
                      {registration.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-foreground/80" dir="ltr">
                    <a
                      className="hover:text-brand"
                      href={`mailto:${registration.email}`}
                    >
                      {registration.email}
                    </a>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                    {t.table.address}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/80">
                    {registration.address}
                    <br />
                    {registration.postalCode} {registration.city}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                  {t.table.children} ({registration.children.length})
                </p>
                <ul className="mt-2 space-y-2">
                  {registration.children.map((child) => {
                    const age = ageFrom(child.birthDate);
                    return (
                      <li
                        key={child.id}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-background px-4 py-2.5"
                      >
                        <span className="font-medium text-navy">
                          {child.fullName}
                        </span>
                        <span className="text-sm text-foreground/65" dir="ltr">
                          {formatDate(child.birthDate, lang)}
                        </span>
                        {age !== null ? (
                          <span className="text-sm text-foreground/65">
                            {age} {t.table.years}
                          </span>
                        ) : null}
                        <span className="text-sm text-foreground/65">
                          {child.gender === "male"
                            ? dict.register.fields.genderMale
                            : dict.register.fields.genderFemale}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge
                  ok={registration.regulationsAccepted}
                  label={`${t.table.regulations}: ${
                    registration.regulationsAccepted ? t.table.yes : t.table.no
                  }`}
                />
                <Badge
                  ok={registration.attendanceCommitment}
                  label={`${t.table.attendance}: ${
                    registration.attendanceCommitment
                      ? t.table.yes
                      : t.table.no
                  }`}
                />
              </div>

              {registration.notes ? (
                <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <span className="font-semibold">{t.table.notes}: </span>
                  {registration.notes}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
