// lib/getToken.ts
export function getTokenFromCookies(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}
