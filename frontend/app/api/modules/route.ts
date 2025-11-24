// app/api/modules/route.ts
import { getTokenFromCookies } from "@/lib/getToken";
import { NextResponse } from "next/server";

// GET all modules
export async function GET(req: Request) {
  const token = getTokenFromCookies(req);
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: errorText || `Backend returned ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// Create a new module
export async function POST(req: Request) {
  try {
    const token = getTokenFromCookies(req);
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const formData = await req.formData();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/modules`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          type: "multipart/form-data",
        },
      }
    );

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const text = await response.text();
      return NextResponse.json({ message: text }, { status: response.status });
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
