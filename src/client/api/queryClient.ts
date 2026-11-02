import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";
import { NetworkError } from "#client/api/http.ts";

const DAY_MS = 24 * 60 * 60 * 1000;

function retryWhileUnreachable(_failureCount: number, error: Error) {
  return error instanceof NetworkError;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY_MS,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: retryWhileUnreachable,
      retryDelay: 1000,
      // Queued writes refetch once they land. Refetching on reconnect too could briefly show the server's
      // state from before those writes arrive.
      refetchOnReconnect: false,
    },
    mutations: {
      retry: retryWhileUnreachable,
      retryDelay: 1000,
      // One shared scope sends queued writes one at a time, in the order they were made.
      scope: { id: "sync" },
    },
  },
});

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] = {
  persister: createAsyncStoragePersister({ storage: window.localStorage }),
  maxAge: DAY_MS,
};
