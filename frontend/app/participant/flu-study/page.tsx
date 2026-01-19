import FluStudy from "@/components/participant/FluStudy";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

const FluStudyPage = ({
  searchParams,
}: {
  searchParams: Promise<{
    PROLIFIC_PID?: string;
    STUDY_ID?: string;
    SESSION_ID?: string;
  }>;
}) => {
  const params = React.use(searchParams);
  const prolificId = params.PROLIFIC_PID || "";
  const studyId = params.STUDY_ID || "";
  const sessionId = params.SESSION_ID || "";
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex gap-4">
        <Link
          href={`/participant?PROLIFIC_PID=${prolificId}&STUDY_ID=${studyId}&SESSION_ID=${sessionId}`}
        >
          <Button className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 font-bold disabled:opacity-50">
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Flu Study</h1>
      </div>
      <Separator />
      <div className="h-full overflow-hidden rounded-xl">
        <FluStudy participant={{ prolificId, studyId, sessionId }} />
      </div>
    </div>
  );
};

export default FluStudyPage;
