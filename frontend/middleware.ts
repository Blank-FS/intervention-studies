// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, importSPKI } from "jose";

const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

async function getRoleFromJWT(token: string): Promise<string | null> {
  try {
    const key = await importSPKI(PUBLIC_KEY, "RS256");
    const { payload } = await jwtVerify(token, key, { algorithms: ["RS256"] });

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload.role as string;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Public routes always allowed
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Paths that don't require auth
  if (!token) {
    if (pathname === "/" || pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Validate token
  const role = await getRoleFromJWT(token);
  if (!role) {
    // Invalid/expired token → clear cookie and redirect
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("token");
    return res;
  }

  // Redirect from "/" or "/login" to dashboard
  if (pathname === "/" || pathname.startsWith("/login")) {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/researcher", req.url));
    }
    if (role === "USER") {
      return NextResponse.redirect(new URL("/participant", req.url));
    }
  }

  // Protect researcher routes
  if (
    pathname.startsWith("/researcher") &&
    role !== "ADMIN" &&
    role !== "SUPERADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect participant routes
  if (pathname.startsWith("/participant") && role !== "USER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
