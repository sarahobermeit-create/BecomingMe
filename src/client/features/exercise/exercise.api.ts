import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { WorkoutPlan, WorkoutWrite } from "#shared/exercise.ts";

export const exerciseQueryOptions = queryOptions({
  queryKey: ["exercise"],
  queryFn: ({ signal }) => request<WorkoutPlan[]>("/exercise", { signal }),
});

export function useExercise() {
  return useQuery(exerciseQueryOptions);
}

export function registerExerciseWrites() {
  queryClient.setMutationDefaults(["exercise", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as WorkoutWrite;
      return request<WorkoutPlan>(`/exercise/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveWorkout() {
  return useMutation({
    mutationKey: ["exercise", "write"],
    onMutate: async (write: WorkoutWrite) => {
      await queryClient.cancelQueries({ queryKey: ["exercise"] });
      const previous = queryClient.getQueryData<WorkoutPlan[]>(["exercise"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: WorkoutPlan = {
        id: write.id,
        title: write.title,
        category: write.category,
        dayOfWeek: write.dayOfWeek,
        durationMin: write.durationMin,
        exercises: write.exercises,
        completedHistory: write.completedHistory,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<WorkoutPlan[]>(["exercise"], previous.filter((w) => w.id !== write.id));
      } else {
        const index = previous.findIndex((w) => w.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<WorkoutPlan[]>(["exercise"], [next, ...previous]);
        } else {
          queryClient.setQueryData<WorkoutPlan[]>(
            ["exercise"],
            previous.map((w) => (w.id === write.id ? next : w)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["exercise"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["exercise"] });
    },
  });
}
