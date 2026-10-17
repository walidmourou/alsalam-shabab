import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAuthenticated } from "@/lib/auth";
import { getDictionary, isLocale, type Dictionary, type Locale } from "@/lib/i18n";
import {
  getRegistrationStats,
  listRegistrations,
  type Registration,
  type RegistrationStats,
} from "@/lib/registrations";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Suspense fallback={<AdminSkeleton label={dict.admin.subtitle} />}>
        <AdminGate lang={lang} dict={dict} />
      </Suspense>
    </div>
  );
}

function AdminSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded-full bg-black/5" />
      <div className="rounded-3xl border border-black/5 bg-white p-10 text-center text-sm text-foreground/50">
        {label}
      </div>
    </div>
  );
}

async function AdminGate({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  if (!(await isAuthenticated())) {
    return <AdminLoginForm dict={dict} />;
  }

  let data: {
    registrations: Registration[];
    stats: RegistrationStats;
  } | null = null;

  try {
    const [registrations, stats] = await Promise.all([
      listRegistrations(),
      getRegistrationStats(),
    ]);
    data = { registrations, stats };
  } catch (error) {
    console.error("[yc] Failed to load registrations:", error);
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-base font-semibold text-red-800">
          {dict.admin.loadError}
        </p>
      </div>
    );
  }

  return (
    <AdminDashboard
      lang={lang}
      dict={dict}
      registrations={data.registrations}
      stats={data.stats}
    />
  );
}
