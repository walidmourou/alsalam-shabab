import { NextResponse, type NextRequest } from "next/server";

const locales = ["de", "ar"] as const;
const defaultLocale = "de";

/** Picks the best supported locale from the `Accept-Language` header. */
function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase() ?? "")
    .filter(Boolean);

  for (const language of preferred) {
    if (language.startsWith("ar")) return "ar";
    if (language.startsWith("de")) return "de";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${
    pathname === "/" ? "" : pathname
  }`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals, API routes and any request for a file (e.g.
  // /shabab.mp4, /logo.png) so only page navigations are localised.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
