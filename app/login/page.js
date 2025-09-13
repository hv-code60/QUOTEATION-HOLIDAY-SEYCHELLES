"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      const d = await res.json();
      setError(d.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8 rounded-xl shadow-lg bg-zinc-900">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Login</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-300">Username</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              className="bg-zinc-800 text-white placeholder-gray-500 border-none focus:ring-2 focus:ring-green-500 rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-zinc-800 text-white placeholder-gray-500 border-none focus:ring-2 focus:ring-green-500 rounded-lg"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-lg"
          >
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
