import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { Hobby, HobbyWrite } from "#shared/hobbies.ts";

export const hobbiesQueryOptions = queryOptions({
  queryKey: ["hobbies"],
  queryFn: ({ signal }) => request<Hobby[]>("/hobbies", { signal }),
});

export function useHobbies() {
  return useQuery(hobbiesQueryOptions);
}

export function registerHobbyWrites() {
  queryClient.setMutationDefaults(["hobbies", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as HobbyWrite;
      return request<Hobby>(`/hobbies/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveHobby() {
  return useMutation({
    mutationKey: ["hobbies", "write"],
    onMutate: async (write: HobbyWrite) => {
      await queryClient.cancelQueries({ queryKey: ["hobbies"] });
      const previous = queryClient.getQueryData<Hobby[]>(["hobbies"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: Hobby = {
        id: write.id,
        name: write.name,
        category: write.category,
        level: write.level,
        hoursSpent: write.hoursSpent,
        targetWeeklyHours: write.targetWeeklyHours,
        currentProject: write.currentProject,
        milestones: write.milestones,
        notes: write.notes,
        icon: write.icon,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<Hobby[]>(["hobbies"], previous.filter((h) => h.id !== write.id));
      } else {
        const index = previous.findIndex((h) => h.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<Hobby[]>(["hobbies"], [next, ...previous]);
        } else {
          queryClient.setQueryData<Hobby[]>(
            ["hobbies"],
            previous.map((h) => (h.id === write.id ? next : h)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["hobbies"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["hobbies"] });
    },
  });
}
