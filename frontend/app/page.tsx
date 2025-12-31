"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Button
        className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 w-32 font-bold"
        onClick={() => router.push("/auth")}
      >
        Login
      </Button>
    </main>
  );
}
