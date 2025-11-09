import { Module } from "@/types/definition";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import InteractiveQuestionSection from "@/components/common/module/InteractiveQuestionSection";

const InteractiveModule = ({
  module,
  ToggleComponent,
  preview = false,
}: {
  module: Module;
  ToggleComponent: React.FC;
  preview?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">{module.title}</h3>
        <ToggleComponent />
      </div>

      <Card className="p-6">
        <p>{module.paragraph}</p>
        <video
          src={`/api/videos/${module.videoUrl}`}
          controls
          className="w-full max-h-96 rounded border"
        />
      </Card>

      <Separator orientation="horizontal" />
      <InteractiveQuestionSection moduleId={module.id} preview={preview} />
    </div>
  );
};

export default InteractiveModule;
