// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // proteksi semua route /dashboard
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("pw_token")?.value;
    if (!token) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
