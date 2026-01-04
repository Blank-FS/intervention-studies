// app/api/responses/route.ts
import { getTokenFromCookies } from "@/lib/getToken";
import { NextResponse } from "next/server";

const BASE_URL = process.env.INTERNAL_API_URL || "";

export async function POST(req: Request) {
  try {
    const token = getTokenFromCookies(req);
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const { questionId, optionId } = await req.json();

    // Create response entry in backend
    const backendResponse = await fetch(`${BASE_URL}/api/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, optionId }),
    });

    if (!backendResponse.ok) {
      const err = await backendResponse.json().catch(() => ({}));
      console.error("Backend error:", err);
      return NextResponse.json(
        { error: err.message || "Failed to save response" },
        { status: backendResponse.status },
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error saving response:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
