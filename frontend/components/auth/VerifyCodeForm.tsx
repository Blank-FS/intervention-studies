"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VerifyCodeFormProps {
  email: string;
}

export default function VerifyCodeForm({ email }: VerifyCodeFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      if (res.ok) {
        // on success, log in the user automatically and set cookie
        const data = await res.json();
        const cookieRes = await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        });
        if (!cookieRes.ok) throw new Error("Failed to set token cookie");

        // Redirect to participant home
        router.push("/participant");
      } else {
        const text = await res.text();
        setError(text || "Invalid or expired code.");
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
      onSubmit={handleVerify}
      className="p-6 shadow rounded border w-full max-w-md"
    >
      <h2 className="text-lg font-semibold mb-4">Enter Verification Code</h2>
      <p className="mb-3 text-sm text-gray-600">
        A code has been sent to <strong>{email}</strong>. Please enter it below.
      </p>

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <label className="block mb-4">
        <span>Verification Code</span>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 block w-full border p-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
