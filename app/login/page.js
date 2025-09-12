
"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  async function onSubmit(e){ e.preventDefault(); setError(""); const res = await fetch("/api/auth/login",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email,password }) }); if(res.ok){ window.location.href="/dashboard"; } else { const d = await res.json(); setError(d.error||"Login failed"); } }
  return (<div className="w-full max-w-md mx-auto mt-24"><Card><h1 className="text-2xl font-semibold mb-4">Login</h1><form onSubmit={onSubmit} className="space-y-3">
    <div><div className="label">Email</div><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" /></div>
    <div><div className="label">Password</div><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
    {error && <div className="text-red-400 text-sm">{error}</div>}
    <Button type="submit" className="w-full">Sign in</Button></form></Card></div>);
}
