import FluStudy from "@/components/participant/FluStudy";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

const FluStudyPage = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex gap-4">
        <Link href="/participant">
          <Button className="bg-umich-maize text-umich-blue hover:bg-umich-maize/80 font-bold disabled:opacity-50">
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Flu Study</h1>
      </div>
      <Separator />
      <div className="h-full overflow-hidden rounded-xl">
        <FluStudy />
      </div>
    </div>
  );
};

export default FluStudyPage;
