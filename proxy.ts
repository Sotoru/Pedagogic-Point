import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

// Gate every /admin/* route behind the signed session cookie, except the login
// page itself. Unauthenticated requests are redirected to /admin/login. See
// ADR 0010. jose verifies on the Edge runtime via Web Crypto.
// (Next 16 renamed "middleware" to "proxy"; same functionality.)
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
