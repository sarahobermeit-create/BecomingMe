import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { WaterLog, WaterWrite } from "#shared/water.ts";

export const waterLogsQueryOptions = queryOptions({
  queryKey: ["waterLogs"],
  queryFn: ({ signal }) => request<WaterLog[]>("/water", { signal }),
});

export function useWaterLogs() {
  return useQuery(waterLogsQueryOptions);
}

export function registerWaterWrites() {
  queryClient.setMutationDefaults(["waterLogs", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as WaterWrite;
      return request<WaterLog>(`/water/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveWaterLog() {
  return useMutation({
    mutationKey: ["waterLogs", "write"],
    onMutate: async (write: WaterWrite) => {
      await queryClient.cancelQueries({ queryKey: ["waterLogs"] });
      const previous = queryClient.getQueryData<WaterLog[]>(["waterLogs"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: WaterLog = {
        id: write.id,
        date: write.date,
        amountMl: write.amountMl,
        targetMl: write.targetMl,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<WaterLog[]>(["waterLogs"], previous.filter((w) => w.id !== write.id));
      } else {
        const index = previous.findIndex((w) => w.id === write.id || w.date === write.date);
        if (index === -1) {
          queryClient.setQueryData<WaterLog[]>(["waterLogs"], [next, ...previous]);
        } else {
          queryClient.setQueryData<WaterLog[]>(
            ["waterLogs"],
            previous.map((w, idx) => (idx === index ? next : w)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["waterLogs"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["waterLogs"] });
    },
  });
}
