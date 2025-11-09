"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Helper: decode JWT and return role
function getRoleFromToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return null;
  }
}

export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      // Store JWT in secure httpOnly cookie via API route
      const cookieRes = await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token }),
      });

      if (!cookieRes.ok) throw new Error("Failed to set token cookie");

      // Get role from JWT and redirect
      const role = getRoleFromToken(data.token);

      if (role === "RESEARCHER") {
        router.push("/researcher");
      } else if (role === "PARTICIPANT") {
        router.push("/participant");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-md">
      <form onSubmit={handleLogin}>
        <h2 className="text-lg font-semibold mb-4">Login</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}

        <label className="block mb-2">
          <span>Email</span>
          <Input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <label className="block mb-4">
          <span>Password</span>
          <Input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="w-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </form>
    </Card>
  );
}
