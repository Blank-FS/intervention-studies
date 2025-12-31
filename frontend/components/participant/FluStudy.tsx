"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const FluStudy = () => {
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

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      // Optional: check origin for security
      // if (event.origin !== "http://localhost:3000") return;

      if (event.data?.type !== "STUDY_COMPLETE") return;
      const { csv } = event.data.payload;
      setIsCompleted(true);

      // Save study results to backend
      try {
        const res = await fetch(`/api/proxy?path=/api/flu-study`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            csvData: csv,
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

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
        Thank you for completing the study!
      </div>
    );
  }

  return (
    <iframe
      src="/flu-study/index.html"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default FluStudy;
