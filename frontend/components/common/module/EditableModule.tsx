import React from "react";
import { Module } from "@/types/definition";
import EditableQuestionSection from "./EditableQuestionSection";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const EditableModule = ({
  module,
  ToggleComponent,
}: {
  module: Module;
  ToggleComponent: React.FC;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <h3 className="text-2xl font-bold">{module.title}</h3>
          <Badge variant="default">Module ID: {module.id}</Badge>
        </div>
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
      <EditableQuestionSection moduleId={module.id} />
    </div>
  );
};

export default EditableModule;
