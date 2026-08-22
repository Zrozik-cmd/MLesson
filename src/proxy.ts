import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createIntlMiddleware(routing);

// /admin is not locale-routed (see spec §56) — it gets its own auth check.
// Everything else goes through next-intl's locale middleware.
const adminMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export default function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return adminMiddleware(req, {} as never);
  }
  return intlMiddleware(req);
}

export const config = {
  // Runs on every path except API routes, the Telegram redirect (not
  // locale-routed), Next internals, and files with an extension.
  matcher: ["/((?!api|telegram|_next|_vercel|.*\\..*).*)"],
};
