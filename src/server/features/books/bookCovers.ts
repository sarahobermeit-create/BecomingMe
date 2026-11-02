import { existsSync, mkdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, like, sql } from "drizzle-orm";
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

export async function downloadAndSaveCover(url: string, bookId: string): Promise<string> {
  if (!url || url.startsWith("/api/books/covers/")) return url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  const filename = `${bookId}.jpg`;
  const filepath = getCoverFilePath(filename);

  if (coverExists(filename)) {
    return `/api/books/covers/${filename}`;
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "BecomingMe/1.0" },
    });
    if (!res.ok) return url;

    const buffer = await res.arrayBuffer();
    // Open Library returns 1x1 gif (<500 bytes) when cover does not exist
    if (buffer.byteLength < 500) return url;

    await writeFile(filepath, Buffer.from(buffer));
    return `/api/books/covers/${filename}`;
  } catch {
    return url;
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

  while (downloadQueue.length > 0) {
    const item = downloadQueue.shift();
    if (!item) continue;
    queuedBookIds.delete(item.bookId);

    try {
      const localUrl = await downloadAndSaveCover(item.url, item.bookId);
      if (localUrl.startsWith("/api/books/covers/")) {
        await db
          .update(books)
          .set({ coverUrl: localUrl, updatedAt: new Date() })
          .where(eq(books.id, item.bookId));
      } else {
        // Failed or non-existent cover; don't re-queue continuously in this process
        failedBookIds.add(item.bookId);
      }
    } catch {
      failedBookIds.add(item.bookId);
    }

    // Rate-limiting delay to respect Open Library
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  isProcessingQueue = false;
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

  const total = totalRes?.count ?? 0;
  const local = localRes?.count ?? 0;
  const remote = remoteRes?.count ?? 0;

  return {
    total,
    localCached: local,
    pendingRemote: remote,
    queueRemaining: downloadQueue.length,
    isProcessing: isProcessingQueue,
    failedCount: failedBookIds.size,
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
