import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { Transaction, TransactionWrite } from "#shared/budget.ts";

export const budgetQueryOptions = queryOptions({
  queryKey: ["budget"],
  queryFn: ({ signal }) => request<Transaction[]>("/budget", { signal }),
});

export function useBudget() {
  return useQuery(budgetQueryOptions);
}

export function registerBudgetWrites() {
  queryClient.setMutationDefaults(["budget", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as TransactionWrite;
      return request<Transaction>(`/budget/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveTransaction() {
  return useMutation({
    mutationKey: ["budget", "write"],
    onMutate: async (write: TransactionWrite) => {
      await queryClient.cancelQueries({ queryKey: ["budget"] });
      const previous = queryClient.getQueryData<Transaction[]>(["budget"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: Transaction = {
        id: write.id,
        date: write.date,
        type: write.type,
        category: write.category,
        amount: write.amount,
        title: write.title,
        notes: write.notes,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<Transaction[]>(["budget"], previous.filter((t) => t.id !== write.id));
      } else {
        const index = previous.findIndex((t) => t.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<Transaction[]>(["budget"], [next, ...previous]);
        } else {
          queryClient.setQueryData<Transaction[]>(
            ["budget"],
            previous.map((t) => (t.id === write.id ? next : t)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["budget"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
}
