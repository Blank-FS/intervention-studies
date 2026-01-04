// lib/auth.ts

import { importSPKI, jwtVerify } from "jose";
import { NextRequest } from "next/server";

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
