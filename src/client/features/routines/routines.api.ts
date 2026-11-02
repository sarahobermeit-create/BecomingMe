import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { RoutineItem, RoutineWrite } from "#shared/routines.ts";

export const routinesQueryOptions = queryOptions({
  queryKey: ["routines"],
  queryFn: ({ signal }) => request<RoutineItem[]>("/routines", { signal }),
});

export function useRoutines() {
  return useQuery(routinesQueryOptions);
}

export function registerRoutineWrites() {
  queryClient.setMutationDefaults(["routines", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as RoutineWrite;
      return request<RoutineItem>(`/routines/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveRoutine() {
  return useMutation({
    mutationKey: ["routines", "write"],
    onMutate: async (write: RoutineWrite) => {
      await queryClient.cancelQueries({ queryKey: ["routines"] });
      const previous = queryClient.getQueryData<RoutineItem[]>(["routines"]) ?? [];

      const now = new Date(write.changedAt).toISOString();
      const next: RoutineItem = {
        id: write.id,
        title: write.title,
        category: write.category,
        time: write.time,
        completedDates: write.completedDates,
        tags: write.tags,
        sortOrder: write.sortOrder,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<RoutineItem[]>(["routines"], previous.filter((r) => r.id !== write.id));
      } else {
        const index = previous.findIndex((r) => r.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<RoutineItem[]>(["routines"], [...previous, next]);
        } else {
          queryClient.setQueryData<RoutineItem[]>(
            ["routines"],
            previous.map((r) => (r.id === write.id ? next : r)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["routines"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });
}
