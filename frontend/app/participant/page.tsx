// app/participant/page.tsx
"use client";

import FluStudyCard from "@/components/participant/FluStudyCard";
import ModuleSection from "@/components/participant/ModuleSection";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

export default function ParticipantPage() {
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    async function fetchCompleteStatus() {
      try {
        const res = await fetch(`/api/proxy?path=/api/flu-study/status`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch study status:", err);
          return;
        }

        const data: { message: string; completed: boolean } = await res.json();
        setIsCompleted(data.completed);
      } catch (err) {
        console.error("Network error:", err);
      }
    }
    fetchCompleteStatus().finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <h1 className="text-2xl font-bold">Available Studies</h1>
      <Separator />
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-24" />
        </div>
      )}

      {/* List of Studies */}
      {!loading && (
        <div className="flex items-center gap-2">
          <FluStudyCard completed={isCompleted} />
        </div>
      )}
    </div>
  );
}
