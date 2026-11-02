import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { Book, BookWrite, ExternalBookInfo } from "#shared/books.ts";

export const booksQueryOptions = queryOptions({
  queryKey: ["books"],
  queryFn: ({ signal }) => request<Book[]>("/books", { signal }),
});

export function useBooks() {
  return useQuery(booksQueryOptions);
}

export function registerBookWrites() {
  queryClient.setMutationDefaults(["books", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as BookWrite;
      return request<Book>(`/books/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveBook() {
  return useMutation({
    mutationKey: ["books", "write"],
    onMutate: async (write: BookWrite) => {
      await queryClient.cancelQueries({ queryKey: ["books"] });
      const previous = queryClient.getQueryData<Book[]>(["books"]) ?? [];

      const now = new Date(write.changedAt).toISOString();
      const nextBook: Book = {
        id: write.id,
        title: write.title,
        author: write.author,
        status: write.status,
        format: write.format,
        totalPages: write.totalPages,
        currentPage: write.currentPage,
        audioDurationMinutes: write.audioDurationMinutes,
        currentAudioMinutes: write.currentAudioMinutes,
        rating: write.rating,
        coverUrl: write.coverUrl,
        startDate: write.startDate,
        finishDate: write.finishDate,
        favoriteQuotes: write.favoriteQuotes,
        notes: write.notes,
        sortOrder: write.sortOrder,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<Book[]>(["books"], previous.filter((b) => b.id !== write.id));
      } else {
        const index = previous.findIndex((b) => b.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<Book[]>(["books"], [...previous, nextBook]);
        } else {
          queryClient.setQueryData<Book[]>(
            ["books"],
            previous.map((b) => (b.id === write.id ? nextBook : b)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["books"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useBatchSaveBooks() {
  return useMutation({
    mutationFn: async (writes: BookWrite[]) => {
      return request<{ count: number; items: Book[] }>("/books/batch", {
        method: "POST",
        body: JSON.stringify({ items: writes }),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const save = useSaveBook();
  return {
    deleteBook: (book: Book) =>
      save.mutate({
        ...book,
        deleted: true,
        changedAt: Date.now(),
      }),
  };
}

export async function searchBooksOnline(query: string): Promise<ExternalBookInfo[]> {
  const res = await request<{ results: ExternalBookInfo[] }>(`/books/search?q=${encodeURIComponent(query)}`);
  return res.results;
}

export async function lookupBookByIsbn(isbn: string): Promise<ExternalBookInfo> {
  return request<ExternalBookInfo>(`/books/isbn?isbn=${encodeURIComponent(isbn)}`);
}

export interface CoversStatus {
  total: number;
  localCached: number;
  pendingRemote: number;
  queueRemaining: number;
  isProcessing: boolean;
  failedCount: number;
}

export function useCoversStatus() {
  return useQuery({
    queryKey: ["books", "covers-status"],
    queryFn: ({ signal }) => request<CoversStatus>("/books/covers/status", { signal }),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.isProcessing || (data?.queueRemaining ?? 0) > 0 ? 3000 : 30000;
    },
  });
}

export function useCacheMissingCovers() {
  return useMutation({
    mutationFn: async () => {
      return request<{ queued: number }>("/books/cache-covers", {
        method: "POST",
        body: JSON.stringify({}),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["books", "covers-status"] });
      void queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
