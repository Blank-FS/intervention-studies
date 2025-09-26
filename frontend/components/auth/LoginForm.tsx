"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <form
      onSubmit={handleLogin}
      className="p-6 shadow rounded border w-full max-w-md"
    >
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}

      <label className="block mb-2">
        <span>Email</span>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <label className="block mb-4">
        <span>Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </form>
  );
}
