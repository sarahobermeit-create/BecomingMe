import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { IdeaWrite, LifeIdea } from "#shared/ideas.ts";

export const ideasQueryOptions = queryOptions({
  queryKey: ["ideas"],
  queryFn: ({ signal }) => request<LifeIdea[]>("/ideas", { signal }),
});

export function useIdeas() {
  return useQuery(ideasQueryOptions);
}

export function registerIdeaWrites() {
  queryClient.setMutationDefaults(["ideas", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as IdeaWrite;
      return request<LifeIdea>(`/ideas/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveIdea() {
  return useMutation({
    mutationKey: ["ideas", "write"],
    onMutate: async (write: IdeaWrite) => {
      await queryClient.cancelQueries({ queryKey: ["ideas"] });
      const previous = queryClient.getQueryData<LifeIdea[]>(["ideas"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: LifeIdea = {
        id: write.id,
        title: write.title,
        description: write.description,
        category: write.category,
        status: write.status,
        priority: write.priority,
        targetDate: write.targetDate,
        actionItems: write.actionItems,
        tags: write.tags,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<LifeIdea[]>(["ideas"], previous.filter((i) => i.id !== write.id));
      } else {
        const index = previous.findIndex((i) => i.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<LifeIdea[]>(["ideas"], [next, ...previous]);
        } else {
          queryClient.setQueryData<LifeIdea[]>(
            ["ideas"],
            previous.map((i) => (i.id === write.id ? next : i)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["ideas"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
}
