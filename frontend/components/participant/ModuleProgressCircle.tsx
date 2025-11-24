"use client";

import { useModuleProgress } from "@/lib/hooks/useModuleProgress";
import { ModuleProgressType } from "@/lib/types/module";
import React from "react";

const ModuleProgressCircle = ({ moduleId }: { moduleId: number }) => {
  const { data: progress } = useModuleProgress(moduleId);

  const getProgressColor = (status?: ModuleProgressType) => {
    switch (status) {
      case ModuleProgressType.NOT_STARTED:
        return "bg-neutral-500";
      case ModuleProgressType.IN_PROGRESS:
        return "bg-blue-500";
      case ModuleProgressType.COMPLETE:
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  if (!progress) return null;

  return (
    <div
      className={`border-muted size-8 rounded-full border ${getProgressColor(progress.progress)}`}
    ></div>
  );
};

export default ModuleProgressCircle;
