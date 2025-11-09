"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Button onClick={() => router.push("/auth")}>Login</Button>
    </main>
  );
}
