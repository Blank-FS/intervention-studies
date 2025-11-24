import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModuleProgress, ModuleProgressType } from "@/lib/types/module";

export function useUpdateModuleProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      moduleId,
      progress,
    }: {
      moduleId: number;
      progress: ModuleProgressType;
    }) => {
      const apiPath = `/api/progress?moduleId=${moduleId}&progressUpdate=${progress}`;
      const encodedPath = encodeURIComponent(apiPath);

      const res = await fetch(`/api/proxy?path=${encodedPath}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update progress");
      return res.json() as Promise<ModuleProgress>;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["module-progress", data.moduleId],
      });
    },
  });
}
