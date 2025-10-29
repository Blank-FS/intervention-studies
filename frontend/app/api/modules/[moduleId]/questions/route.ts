// TODO: Ensure that post request is implemented correctly

// app/api/modules/[moduleId]/questions/route.ts
import { getTokenFromCookies } from "@/lib/getToken";
import { NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET questions for a specific module based on its ID
export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  const token = getTokenFromCookies(req);
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    const { moduleId } = await params;
    const res = await fetch(`${BASE_URL}/api/modules/${moduleId}/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error fetching questions:", errorText);
      return NextResponse.json(
        { error: errorText || `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch questions: " + (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${BASE_URL}/api/modules/${params.moduleId}/questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || `Backend returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Proxy POST /api/modules/:id/questions error:", err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
