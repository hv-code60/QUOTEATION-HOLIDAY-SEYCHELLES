
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;
  const isAuthRoute = url.pathname.startsWith("/login") || url.pathname.startsWith("/api/auth");
  if (isAuthRoute) return NextResponse.next();
  if (!token) { url.pathname = "/login"; return NextResponse.redirect(url); }
  try { await jwtVerify(token, secret); return NextResponse.next(); }
  catch { url.pathname = "/login"; return NextResponse.redirect(url); }
}
export const config = { matcher: ["/((?!_next|favicon.ico|api/auth|images|public).*)"] };
