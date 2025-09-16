// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { jwtVerify, importSPKI } from "jose";

// Your backend's public key in PEM format
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

async function verifyJWT(token: string) {
  try {
    const key = await importSPKI(PUBLIC_KEY, "RS256");
    const { payload } = await jwtVerify(token, key, { algorithms: ["RS256"] });
    return {
      valid: true,
      role: payload.role as string,
      exp: payload.exp as number,
    };
  } catch (err) {
    console.error("JWT verification failed", err);
    return { valid: false, role: null, exp: 0 };
  }
}

export async function GET(req: Request) {
  const { cookies } = req as any;
  const token = cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  const { valid, role, exp } = await verifyJWT(token);

  // Expired or invalid token
  if (!valid || (exp && Date.now() / 1000 > exp)) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true, role });
}
