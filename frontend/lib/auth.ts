import { importSPKI, jwtVerify } from "jose";
import { NextRequest } from "next/server";

// lib/auth.ts
export async function resendVerificationEmail(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/identity/auth/verify/resend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  // Try to parse JSON if backend returns it
  let data: any = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Failed to resend (HTTP ${res.status})`;

    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  role: string;
};

export type LoggedInUser = {
  email: string;
  role: string;
};

export async function getLoggedInUserFromJWT(
  token: string,
): Promise<LoggedInUser | null> {
  const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;
  try {
    const key = await importSPKI(PUBLIC_KEY, "RS256");
    const { payload } = await jwtVerify(token, key, { algorithms: ["RS256"] });
    const tokenPayload = payload as JwtPayload;

    // Check expiry
    if (Date.now() / 1000 > tokenPayload.exp) {
      console.log("Token expired");
      return null;
    }

    return {
      email: tokenPayload.sub,
      role: tokenPayload.role,
    };
  } catch (e) {
    console.log("Failed to verify JWT:", e);
    return null;
  }
}

export async function getLoggedInUser(
  req: NextRequest,
): Promise<LoggedInUser | null> {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return await getLoggedInUserFromJWT(token);
}
