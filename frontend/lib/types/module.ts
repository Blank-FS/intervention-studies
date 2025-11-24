export interface Module {
  id: number;
  title: string;
  paragraph: string;
  videoPath: string;
}

export enum ModuleProgressType {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}

export interface ModuleProgress {
  moduleId: number;
  userId: number;
  progress: ModuleProgressType;
}
