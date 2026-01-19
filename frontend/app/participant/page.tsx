// app/participant/page.tsx
"use client";

import FluStudyCard from "@/components/common/FluStudyCard";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function ParticipantPage({
  searchParams,
}: {
  searchParams: Promise<{
    PROLIFIC_PID?: string;
    STUDY_ID?: string;
    SESSION_ID?: string;
  }>;
}) {
  const params = React.use(searchParams);
  const prolificId = params.PROLIFIC_PID || "";
  const studyId = params.STUDY_ID || "";
  const sessionId = params.SESSION_ID || "";
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <h1 className="text-2xl font-bold">Available Studies</h1>
      <Separator />

      <div className="flex items-center gap-2">
        <FluStudyCard
          completed={false}
          participant={{
            prolificId: prolificId,
            studyId: studyId,
            sessionId: sessionId,
          }}
        />
      </div>
    </div>
  );
}
