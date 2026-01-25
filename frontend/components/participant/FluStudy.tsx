"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Participant } from "@/lib/types/user";

const FluStudy = ({ participant }: { participant: Participant }) => {
  // const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const searchParams = useSearchParams();

  /**
   * Passthrough allowed query params from the Next.js URL
   */
  const iframeSrc = useMemo(() => {
    const ALLOWED_PARAMS = [
      "cond",
      "reset",
      "PROLIFIC_PID",
      "STUDY_ID",
      "SESSION_ID",
    ];
    const params = new URLSearchParams();
    ALLOWED_PARAMS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        params.set(key, value);
      }
    });

    const src = `/flu-study/index.html?${params.toString()}`;
    return src;
  }, [searchParams, participant]);

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      // Optional: check origin for security
      // if (event.origin !== window.location.origin) return;

      if (event.data?.type !== "STUDY_COMPLETE") return;
      const { csv } = event.data.payload;
      setIsCompleted(true);

      // Save study results to backend
      try {
        const res = await fetch(`/api/proxy?path=/api/flu-study/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            csvData: csv,
            prolificId: participant.prolificId,
            studyId: participant.studyId,
            sessionId: participant.sessionId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to save study:", err);
          toast.error("Failed to submit study response.");
          return;
        }
        toast.success("Study response submitted successfully!");
      } catch (err) {
        console.error("Network error:", err);
        toast.error("Network error while submitting study.");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (isCompleted) {
    return (
      <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
        Thank you for completing the study!
      </div>
    );
  }

  return (
    <iframe
      src={iframeSrc}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default FluStudy;
