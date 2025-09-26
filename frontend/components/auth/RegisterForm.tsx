"use client";

import Link from "next/link";
import { useState } from "react";

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
        }
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
    <form
      onSubmit={handleSubmit}
      className="p-6 shadow rounded border w-full max-w-md"
    >
      <h2 className="text-lg font-semibold mb-4">Create an account</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}

      <label className="block mb-2">
        <span>Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <label className="block mb-2">
        <span>Prolific ID</span>
        <input
          type="text"
          required
          value={prolificId}
          onChange={(e) => setProlificId(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <label className="block mb-2">
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

      <label className="block mb-4">
        <span>Confirm Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Register"}
      </button>
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="text-blue-600 hover:underline"
          disabled={loading}
        >
          Login here
        </button>
      </p>
    </form>
  );
}
