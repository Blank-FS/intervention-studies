import React from "react";
import EditableQuestionSection from "./EditableQuestionSection";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Module } from "@/lib/types/module";

const EditableModule = ({
  module,
  ToggleComponent,
}: {
  module: Module;
  ToggleComponent: React.FC;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold">{module.title}</h3>
          <Badge variant="default">Module ID: {module.id}</Badge>
        </div>
        <ToggleComponent />
      </div>

      <Card className="p-6">
        <p>{module.paragraph}</p>
        <video
          src={`/api/videos?path=${module.videoPath}`}
          controls
          className="max-h-96 w-full rounded border"
        />
      </Card>

      <Separator orientation="horizontal" />
      <EditableQuestionSection moduleId={module.id} />
    </div>
  );
};

export default EditableModule;
