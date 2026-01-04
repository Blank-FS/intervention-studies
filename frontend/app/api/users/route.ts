import { getTokenFromCookies } from "@/lib/getToken";
import { NextResponse } from "next/server";

// This route fetches all users
export async function GET(req: Request) {
  const token = getTokenFromCookies(req);
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const res = await fetch(`${process.env.INTERNAL_API_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || "Request failed" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
