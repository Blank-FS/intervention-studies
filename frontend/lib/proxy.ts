// /lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "./getToken";

export async function proxyRequest(req: NextRequest, targetUrl: string) {
  try {
    const token = getTokenFromCookies(req);
    const authRequest = targetUrl.startsWith(
      `${process.env.INTERNAL_API_URL}/auth`,
    );
    if (!authRequest && !token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    const headers = new Headers(req.headers);
    headers.set("Content-Type", "application/json");
    if (!authRequest) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.body ? await req.text() : undefined,
    });

    const data = await response.text();

    const noBodyStatusCodes = [204, 205, 304];
    if (noBodyStatusCodes.includes(response.status))
      return new NextResponse(null, { status: response.status });

    return new NextResponse(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
