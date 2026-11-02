import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { MoodEntry, MoodWrite } from "#shared/mood.ts";

export const moodQueryOptions = queryOptions({
  queryKey: ["mood"],
  queryFn: ({ signal }) => request<MoodEntry[]>("/mood", { signal }),
});

export function useMood() {
  return useQuery(moodQueryOptions);
}

export function registerMoodWrites() {
  queryClient.setMutationDefaults(["mood", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as MoodWrite;
      return request<MoodEntry>(`/mood/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveMood() {
  return useMutation({
    mutationKey: ["mood", "write"],
    onMutate: async (write: MoodWrite) => {
      await queryClient.cancelQueries({ queryKey: ["mood"] });
      const previous = queryClient.getQueryData<MoodEntry[]>(["mood"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: MoodEntry = {
        id: write.id,
        date: write.date,
        score: write.score,
        energyLevel: write.energyLevel,
        label: write.label,
        factors: write.factors,
        journalNote: write.journalNote,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<MoodEntry[]>(["mood"], previous.filter((m) => m.id !== write.id));
      } else {
        const index = previous.findIndex((m) => m.id === write.id || m.date === write.date);
        if (index === -1) {
          queryClient.setQueryData<MoodEntry[]>(["mood"], [next, ...previous]);
        } else {
          queryClient.setQueryData<MoodEntry[]>(
            ["mood"],
            previous.map((m, idx) => (idx === index ? next : m)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["mood"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["mood"] });
    },
  });
}
