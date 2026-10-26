import { isAuthenticated } from "@/lib/auth";
import { ageFrom, formatDate, formatDateTime } from "@/lib/dates";
import { getDictionary, isLocale } from "@/lib/i18n";
import { listRegistrations } from "@/lib/registrations";
import { buildXlsx, type XlsxCell } from "@/lib/xlsx";

/**
 * Downloads every registration as an Excel workbook.
 *
 * The sheet is a flat table with one row per child: the registration fields are
 * repeated for each child so the file can be filtered and sorted directly.
 * The admin session cookie is checked exactly like on the dashboard page.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return new Response("Not found", { status: 404 });
  }

  if (!(await isAuthenticated())) {
    return Response.redirect(new URL(`/${lang}/admin`, request.url), 303);
  }

  let registrations: Awaited<ReturnType<typeof listRegistrations>>;
  try {
    registrations = await listRegistrations();
  } catch (error) {
    console.error("[yc] Failed to load registrations for export:", error);
    return new Response("Failed to load registrations", { status: 500 });
  }

  const dict = getDictionary(lang);
  const columns = dict.admin.exportColumns;

  const genderLabel = (gender: "male" | "female") =>
    gender === "male"
      ? dict.register.fields.genderMale
      : dict.register.fields.genderFemale;

  // Flatten the one-to-many relation: one row per child, with the registration
  // fields repeated. Registrations without children still get one row so no
  // data is lost.
  const rows: XlsxCell[][] = registrations.flatMap((registration) => {
    const parent: XlsxCell[] = [
      registration.id,
      registration.parentName,
      registration.email,
      registration.phone,
      registration.address,
      registration.postalCode,
      registration.city,
    ];
    const rest: XlsxCell[] = [
      registration.children.length,
      registration.regulationsAccepted ? columns.yes : columns.no,
      registration.attendanceCommitment ? columns.yes : columns.no,
      registration.locale,
      registration.notes,
      formatDateTime(registration.createdAt, lang),
    ];

    if (registration.children.length === 0) {
      return [[...parent, null, null, null, null, ...rest]];
    }

    return registration.children.map((child) => [
      ...parent,
      child.fullName,
      formatDate(child.birthDate, lang),
      ageFrom(child.birthDate),
      genderLabel(child.gender),
      ...rest,
    ]);
  });

  const workbook = buildXlsx([
    {
      name: dict.admin.exportSheetRegistrations,
      columns: [
        { header: columns.id, width: 8 },
        { header: columns.parentName, width: 28 },
        { header: columns.email, width: 30 },
        { header: columns.phone, width: 20 },
        { header: columns.address, width: 28 },
        { header: columns.postalCode, width: 10 },
        { header: columns.city, width: 18 },
        { header: columns.childName, width: 28 },
        { header: columns.birthDate, width: 14 },
        { header: columns.age, width: 8 },
        { header: columns.gender, width: 12 },
        { header: columns.children, width: 15 },
        { header: columns.regulations, width: 22 },
        { header: columns.attendance, width: 22 },
        { header: columns.locale, width: 10 },
        { header: columns.notes, width: 40 },
        { header: columns.submittedAt, width: 20 },
      ],
      rows,
    },
  ]);

  const date = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(workbook), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="registrations-${date}.xlsx"`,
      "Content-Length": String(workbook.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
