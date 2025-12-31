// app/api/auth/me/route.ts
import { getLoggedInUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getLoggedInUser(req);
  return NextResponse.json({ loggedInUser: user }, { status: 200 });
}
