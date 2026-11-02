import { existsSync, mkdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, like } from "drizzle-orm";
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

// Background queue to download covers without blocking API requests or overloading Open Library
const downloadQueue: Array<{ url: string; bookId: string }> = [];
let isProcessingQueue = false;

export function queueCoverDownload(url: string, bookId: string) {
  if (!url || url.startsWith("/api/books/covers/")) return;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return;
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

    try {
      const localUrl = await downloadAndSaveCover(item.url, item.bookId);
      if (localUrl.startsWith("/api/books/covers/")) {
        await db
          .update(books)
          .set({ coverUrl: localUrl, updatedAt: new Date() })
          .where(eq(books.id, item.bookId));
      }
    } catch {
      // Continue next in queue
    }

    // Gentle delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  isProcessingQueue = false;
}

export async function cacheAllMissingCovers(): Promise<number> {
  const externalBooks = await db
    .select({ id: books.id, coverUrl: books.coverUrl })
    .from(books)
    .where(like(books.coverUrl, "http%"));

  for (const b of externalBooks) {
    if (b.coverUrl) {
      queueCoverDownload(b.coverUrl, b.id);
    }
  }

  return externalBooks.length;
}
