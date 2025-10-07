// TODO: This route is still in progress and may not be working yet

// app/api/modules/[moduleId]/questions/route.ts
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
