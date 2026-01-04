"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { Separator } from "../ui/separator";
import { useAuth } from "../auth-provider";
import { Spinner } from "../ui/spinner";
import { getLoggedInUserFromJWT } from "@/lib/auth";

// Helper: decode JWT and return role
async function getRoleFromToken(token: string) {
  const loggedInUser = await getLoggedInUserFromJWT(token);
  return loggedInUser?.role || "";
}

export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const { user, refresh } = useAuth();
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
      const res = await fetch(`/api/proxy?path=/auth/token`, {
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
      const loggedInUser = await refresh();
      const role = loggedInUser?.role || "";

      if (role === "ADMIN" || role === "SUPERADMIN") {
        router.push("/researcher");
      } else if (role === "USER") {
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
    <Card className="bg-umich-blue/70 w-full max-w-sm p-4">
      <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
        <div className="border-umich-blue bg-umich-maize *:[svg]:stroke-umich-blue rounded-full border p-4">
          <User className="size-12" />
        </div>
        <h2 className="text-center text-2xl font-bold">User Login</h2>
        <Separator />
        {error && <div className="text-red-600">{error}</div>}

        <label className="block w-full">
          <span>Email</span>
          <Input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <label className="mb-2 block w-full">
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
          className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 w-full font-bold disabled:opacity-50"
        >
          {loading ? <Spinner /> : "Login"}
        </Button>

        <p className="text-center text-sm">
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
