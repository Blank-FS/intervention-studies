"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

interface RegisterFormProps {
  onRegistered: (email: string) => void;
  toggleForm?: () => void;
}

export default function RegisterForm({
  onRegistered,
  toggleForm,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [prolificId, setProlificId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, prolificId, password }),
        },
      );

      if (res.ok) {
        // move to step 2 (enter verification code)
        onRegistered(email);
      } else {
        const data = await res.json();
        setError(`Registration failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-umich-blue/70 w-full max-w-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <h2 className="text-center text-2xl font-bold">Create an account</h2>
        <Separator />
        {error && <div className="text-red-600">{error}</div>}

        <label className="block w-full">
          <span>Email</span>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <label className="block w-full">
          <span>Prolific ID</span>
          <Input
            type="text"
            required
            value={prolificId}
            onChange={(e) => setProlificId(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <label className="block w-full">
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

        <label className="mb-2 block w-full">
          <span>Confirm Password</span>
          <Input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 w-full font-bold disabled:opacity-50"
        >
          {loading ? <Spinner /> : "Register"}
        </Button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            Login here
          </button>
        </p>
      </form>
    </Card>
  );
}
