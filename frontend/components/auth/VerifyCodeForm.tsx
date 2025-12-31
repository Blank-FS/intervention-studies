"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Mail } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useAuth } from "../auth-provider";

interface VerifyCodeFormProps {
  email: string;
}

export default function VerifyCodeForm({ email }: VerifyCodeFormProps) {
  const { user, refresh } = useAuth();
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
        },
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

        await refresh();
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
    <Card className="bg-umich-blue/70 w-full max-w-sm p-4">
      <form
        onSubmit={handleVerify}
        className="flex flex-col items-center gap-4"
      >
        <div className="border-umich-blue bg-umich-maize *:[svg]:stroke-umich-blue rounded-full border p-4">
          <Mail className="size-12" />
        </div>
        <h2 className="text-center text-2xl font-bold">
          Enter Verification Code
        </h2>
        <Separator />
        <p className="text-sm">
          A code has been sent to{" "}
          <i className="text-umich-maize font-bold">{email}</i>. Please enter it
          below. If you don't see it, you may need to{" "}
          <i className="text-umich-maize font-bold">check your spam</i> folder.
        </p>

        {error && <div className="text-red-600">{error}</div>}

        <label className="block w-full">
          <span>Verification Code</span>
          <Input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full border p-2"
          />
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 w-full font-bold disabled:opacity-50"
        >
          {loading ? <Spinner /> : "Verify"}
        </Button>
      </form>
    </Card>
  );
}
