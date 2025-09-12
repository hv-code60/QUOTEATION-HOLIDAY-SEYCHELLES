
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
export async function POST(req){
  const { email, password } = await req.json();
  if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
    const token = signToken({ email });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
