// /lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "./getToken";

export async function proxyRequest(req: NextRequest, targetUrl: string) {
  try {
    const token = getTokenFromCookies(req);
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const headers = new Headers(req.headers);
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.body ? await req.text() : undefined,
    });

    const data = await response.text();
    return new NextResponse(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
