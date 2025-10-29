import { Module } from "@/types/definition";
import React from "react";
import { Separator } from "../ui/separator";
import QuestionSection from "./QuestionSection";

const ModuleItem = ({
  module,
  preview,
}: {
  module: Module;
  preview?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">{module.title}</h3>
      <p>{module.paragraph}</p>
      <video
        src={`/api/videos/${module.videoUrl}`}
        controls
        className="w-full max-h-96 rounded border"
      />
      <Separator orientation="horizontal" />
      <QuestionSection moduleId={module.id} preview={preview} />
    </div>
  );
};

export default ModuleItem;
