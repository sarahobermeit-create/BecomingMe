import { markOffline } from "#client/api/connectivity.ts";

const TIMEOUT_MS = 8000;

// A gateway error means the server is restarting (for example mid-deploy), so it's handled like being offline.
const UNREACHABLE_STATUSES = new Set([502, 503, 504]);

/** The server couldn't be reached. Requests that fail this way pause and retry once it's reachable again. */
export class NetworkError extends Error {}

/** The server answered with an error status. Not retried. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "PUT" | "POST" | "DELETE";
  body?: string;
  signal?: AbortSignal;
}

/** Calls the API. Every server call in the client goes through this. */
export async function request<T>(path: string, { method = "GET", body, signal }: RequestOptions = {}): Promise<T> {
  const signals = [AbortSignal.timeout(TIMEOUT_MS)];
  if (signal) signals.push(signal);

  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      body,
      headers: body ? { "content-type": "application/json" } : undefined,
      signal: AbortSignal.any(signals),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    markOffline();
    throw new NetworkError("Server unreachable", { cause: error });
  }

  if (UNREACHABLE_STATUSES.has(response.status)) {
    markOffline();
    throw new NetworkError(`Server returned ${response.status}`);
  }
  if (!response.ok) throw new ApiError(response.status, await response.text());
  return response.json();
}
