"use client";

import { Module, ModuleProgress, ModuleProgressType } from "@/lib/types/module";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import InteractiveQuestionSection from "@/components/common/module/InteractiveQuestionSection";
import { useModuleProgress } from "@/lib/hooks/useModuleProgress";
import { useUpdateModuleProgress } from "@/lib/hooks/useUpdateModuleProgress";

const InteractiveModule = ({
  module,
  ToggleComponent,
  preview = false,
}: {
  module: Module;
  ToggleComponent: React.FC;
  preview?: boolean;
}) => {
  const { data: progress, isLoading } = useModuleProgress(module.id);
  const updateProgress = useUpdateModuleProgress();

  const handleVideoComplete = () => {
    updateProgress.mutate({
      moduleId: module.id,
      progress: ModuleProgressType.IN_PROGRESS,
    });
  };

  if (isLoading) {
    return <div>Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">{module.title}</h3>
        <ToggleComponent />
      </div>

      <Card className="p-6">
        <p>{module.paragraph}</p>
        <video
          src={`/api/videos?path=${module.videoPath}`}
          controls
          className="max-h-96 w-full rounded border"
          onEnded={handleVideoComplete}
        />
      </Card>
      {(preview ||
        (progress != null &&
          progress.progress !== ModuleProgressType.NOT_STARTED)) && (
        <>
          <Separator orientation="horizontal" />
          <InteractiveQuestionSection moduleId={module.id} preview={preview} />
        </>
      )}
    </div>
  );
};

export default InteractiveModule;
