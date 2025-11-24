import { useQuery } from "@tanstack/react-query";
import { ModuleProgress } from "@/lib/types/module";

export function useModuleProgress(moduleId: number) {
  return useQuery<ModuleProgress>({
    queryKey: ["module-progress", moduleId],
    queryFn: async () => {
      const res = await fetch(
        `/api/proxy?path=/api/progress?moduleId=${moduleId}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });
}
