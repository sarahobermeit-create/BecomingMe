import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { JunkJournalCard, JunkJournalWrite } from "#shared/journal.ts";

export const journalQueryOptions = queryOptions({
  queryKey: ["journal"],
  queryFn: ({ signal }) => request<JunkJournalCard[]>("/journal", { signal }),
});

export function useJournal() {
  return useQuery(journalQueryOptions);
}

export function registerJournalWrites() {
  queryClient.setMutationDefaults(["journal", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as JunkJournalWrite;
      return request<JunkJournalCard>(`/journal/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveJournal() {
  return useMutation({
    mutationKey: ["journal", "write"],
    onMutate: async (write: JunkJournalWrite) => {
      await queryClient.cancelQueries({ queryKey: ["journal"] });
      const previous = queryClient.getQueryData<JunkJournalCard[]>(["journal"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: JunkJournalCard = {
        id: write.id,
        date: write.date,
        title: write.title,
        content: write.content,
        colorScheme: write.colorScheme,
        tags: write.tags,
        imageUrl: write.imageUrl,
        isPinned: write.isPinned,
        sticker: write.sticker,
        song: write.song,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<JunkJournalCard[]>(["journal"], previous.filter((j) => j.id !== write.id));
      } else {
        const index = previous.findIndex((j) => j.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<JunkJournalCard[]>(["journal"], [next, ...previous]);
        } else {
          queryClient.setQueryData<JunkJournalCard[]>(
            ["journal"],
            previous.map((j) => (j.id === write.id ? next : j)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["journal"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}
