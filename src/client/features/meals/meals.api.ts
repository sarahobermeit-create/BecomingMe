import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { MealLogItem, MealWrite } from "#shared/meals.ts";

export const mealsQueryOptions = queryOptions({
  queryKey: ["meals"],
  queryFn: ({ signal }) => request<MealLogItem[]>("/meals", { signal }),
});

export function useMeals() {
  return useQuery(mealsQueryOptions);
}

export function registerMealWrites() {
  queryClient.setMutationDefaults(["meals", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as MealWrite;
      return request<MealLogItem>(`/meals/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveMeal() {
  return useMutation({
    mutationKey: ["meals", "write"],
    onMutate: async (write: MealWrite) => {
      await queryClient.cancelQueries({ queryKey: ["meals"] });
      const previous = queryClient.getQueryData<MealLogItem[]>(["meals"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: MealLogItem = {
        id: write.id,
        date: write.date,
        mealType: write.mealType,
        title: write.title,
        description: write.description,
        calories: write.calories,
        tags: write.tags,
        imageUrl: write.imageUrl,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<MealLogItem[]>(["meals"], previous.filter((m) => m.id !== write.id));
      } else {
        const index = previous.findIndex((m) => m.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<MealLogItem[]>(["meals"], [next, ...previous]);
        } else {
          queryClient.setQueryData<MealLogItem[]>(
            ["meals"],
            previous.map((m) => (m.id === write.id ? next : m)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["meals"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}
