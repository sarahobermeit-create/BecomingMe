import { existsSync, mkdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, isNull, like, sql } from "drizzle-orm";
import { db } from "#server/db.ts";
import { env } from "#server/env.ts";
import { books } from "#server/features/books/books.table.ts";

export const coversDir = join(env.dataDir, "covers");

try {
  mkdirSync(coversDir, { recursive: true });
} catch (err) {
  console.warn("[covers] Failed to create covers directory:", err);
}

export function getCoverFilePath(filename: string): string {
  return join(coversDir, filename);
}

export function coverExists(filename: string): boolean {
  const filepath = getCoverFilePath(filename);
  try {
    return existsSync(filepath) && statSync(filepath).size > 500;
  } catch {
    return false;
  }
}

export type CoverDownloadResult =
  | { status: "saved"; localUrl: string }
  | { status: "not_found" }
  | { status: "error" };

export async function downloadAndSaveCover(url: string, bookId: string): Promise<CoverDownloadResult> {
  if (!url || url.startsWith("/api/books/covers/")) return { status: "not_found" };
  if (!url.startsWith("http://") && !url.startsWith("https://")) return { status: "not_found" };

  const filename = `${bookId}.jpg`;
  const filepath = getCoverFilePath(filename);

  if (coverExists(filename)) {
    return { status: "saved", localUrl: `/api/books/covers/${filename}` };
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "BecomingMe/1.0" },
    });
    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return { status: "error" };

    const buffer = await res.arrayBuffer();
    // Open Library returns 1x1 gif (<500 bytes) when cover does not exist
    if (buffer.byteLength < 500) return { status: "not_found" };

    await writeFile(filepath, Buffer.from(buffer));
    return { status: "saved", localUrl: `/api/books/covers/${filename}` };
  } catch {
    return { status: "error" };
  }
}

// Background queue state
interface QueueItem {
  url: string;
  bookId: string;
}

const downloadQueue: QueueItem[] = [];
const queuedBookIds = new Set<string>();
const failedBookIds = new Set<string>();
let isProcessingQueue = false;
let cancelRequested = false;

export function cancelCoverSync(): { canceled: number } {
  cancelRequested = true;
  const count = downloadQueue.length;
  downloadQueue.length = 0;
  queuedBookIds.clear();
  return { canceled: count };
}

export function queueCoverDownload(url: string, bookId: string) {
  if (!url || url.startsWith("/api/books/covers/")) return;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return;
  if (queuedBookIds.has(bookId) || failedBookIds.has(bookId)) return;

  queuedBookIds.add(bookId);
  downloadQueue.push({ url, bookId });

  if (!isProcessingQueue) {
    void processDownloadQueue();
  }
}

async function processDownloadQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  cancelRequested = false;

  while (downloadQueue.length > 0 && !cancelRequested) {
    const item = downloadQueue.shift();
    if (!item) continue;
    queuedBookIds.delete(item.bookId);

    try {
      const result = await downloadAndSaveCover(item.url, item.bookId);
      if (result.status === "saved") {
        await db
          .update(books)
          .set({ coverUrl: result.localUrl, updatedAt: new Date() })
          .where(eq(books.id, item.bookId));
      } else if (result.status === "not_found") {
        await db
          .update(books)
          .set({ coverUrl: null, updatedAt: new Date() })
          .where(eq(books.id, item.bookId));
        failedBookIds.add(item.bookId);
      } else {
        failedBookIds.add(item.bookId);
      }
    } catch {
      failedBookIds.add(item.bookId);
    }

    if (cancelRequested) break;

    // Rate-limiting delay to respect Open Library
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  isProcessingQueue = false;
  cancelRequested = false;
}

export async function getCoversStatus() {
  const [totalRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books);
  const [localRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books)
    .where(like(books.coverUrl, "/api/books/covers/%"));
  const [remoteRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books)
    .where(like(books.coverUrl, "http%"));
  const [missingRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(books)
    .where(isNull(books.coverUrl));

  const total = totalRes?.count ?? 0;
  const local = localRes?.count ?? 0;
  const remote = remoteRes?.count ?? 0;
  const missing = missingRes?.count ?? 0;

  return {
    total,
    localCached: local,
    pendingRemote: remote,
    queueRemaining: downloadQueue.length,
    isProcessing: isProcessingQueue,
    failedCount: missing,
  };
}

export async function cacheAllMissingCovers(): Promise<number> {
  const externalBooks = await db
    .select({ id: books.id, coverUrl: books.coverUrl })
    .from(books)
    .where(like(books.coverUrl, "http%"));

  let queued = 0;
  for (const b of externalBooks) {
    if (b.coverUrl && !failedBookIds.has(b.id) && !queuedBookIds.has(b.id)) {
      queueCoverDownload(b.coverUrl, b.id);
      queued++;
    }
  }

  return queued;
}
