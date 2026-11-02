import { createReadStream } from "node:fs";
import { basename } from "node:path";
import { and, asc, eq, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import {
  cacheAllMissingCovers,
  coverExists,
  getCoverFilePath,
  queueCoverDownload,
} from "#server/features/books/bookCovers.ts";
import { books } from "#server/features/books/books.table.ts";
import { lookupOpenLibraryIsbn, searchOpenLibrary } from "#server/features/books/openLibrary.ts";
import type { Book, BookWrite } from "#shared/books.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function sanitizeText(str?: unknown): string | undefined {
  if (typeof str !== "string") return undefined;
  const cleaned = str.replace(/\0/g, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

function toBook(row: typeof books.$inferSelect): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    status: row.status as Book["status"],
    format: (row.format as Book["format"]) ?? "physical",
    totalPages: row.totalPages,
    currentPage: row.currentPage,
    audioDurationMinutes: row.audioDurationMinutes ?? undefined,
    currentAudioMinutes: row.currentAudioMinutes ?? undefined,
    rating: row.rating ?? undefined,
    coverUrl: row.coverUrl ?? undefined,
    startDate: row.startDate ?? undefined,
    finishDate: row.finishDate ?? undefined,
    favoriteQuotes: (row.favoriteQuotes as string[]) ?? undefined,
    notes: row.notes ?? undefined,
    sortOrder: row.sortOrder ?? 0,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function booksRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(books)
      .where(isNull(books.deletedAt))
      .orderBy(asc(books.sortOrder), asc(books.createdAt));
    return rows.map(toBook);
  });

  app.get<{ Params: { id: string } }>("/:id", { schema: { params: idParams } }, async (request, reply) => {
    const [row] = await db
      .select()
      .from(books)
      .where(and(eq(books.id, request.params.id), isNull(books.deletedAt)));
    if (!row) return reply.code(404).send({ error: "Book not found" });
    return toBook(row);
  });

  app.put<{ Params: { id: string }; Body: Omit<BookWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        title: sanitizeText(b.title) ?? "Untitled",
        author: sanitizeText(b.author) ?? "Unknown Author",
        status: b.status,
        format: b.format,
        totalPages: typeof b.totalPages === "number" ? b.totalPages : 0,
        currentPage: typeof b.currentPage === "number" ? b.currentPage : 0,
        audioDurationMinutes: b.audioDurationMinutes,
        currentAudioMinutes: b.currentAudioMinutes,
        rating: b.rating,
        coverUrl: sanitizeText(b.coverUrl),
        startDate: sanitizeText(b.startDate),
        finishDate: sanitizeText(b.finishDate),
        favoriteQuotes: Array.isArray(b.favoriteQuotes)
          ? b.favoriteQuotes.map((q) => String(q).replace(/\0/g, ""))
          : undefined,
        notes: sanitizeText(b.notes),
        sortOrder: typeof b.sortOrder === "number" ? b.sortOrder : 0,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(books)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: books.id, set: changes, setWhere: lte(books.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });

      if (changes.coverUrl && changes.coverUrl.startsWith("http")) {
        queueCoverDownload(changes.coverUrl, request.params.id);
      }

      return toBook(row);
    },
  );

  app.post<{ Body: { items: BookWrite[] } }>("/batch", async (request) => {
    const { items } = request.body;
    if (!Array.isArray(items) || items.length === 0) return { count: 0 };

    const results: Book[] = [];
    for (const b of items) {
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        title: sanitizeText(b.title) ?? "Untitled",
        author: sanitizeText(b.author) ?? "Unknown Author",
        status: b.status,
        format: b.format,
        totalPages: typeof b.totalPages === "number" ? b.totalPages : 0,
        currentPage: typeof b.currentPage === "number" ? b.currentPage : 0,
        audioDurationMinutes: b.audioDurationMinutes,
        currentAudioMinutes: b.currentAudioMinutes,
        rating: b.rating,
        coverUrl: sanitizeText(b.coverUrl),
        startDate: sanitizeText(b.startDate),
        finishDate: sanitizeText(b.finishDate),
        favoriteQuotes: Array.isArray(b.favoriteQuotes)
          ? b.favoriteQuotes.map((q) => String(q).replace(/\0/g, ""))
          : undefined,
        notes: sanitizeText(b.notes),
        sortOrder: typeof b.sortOrder === "number" ? b.sortOrder : 0,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(books)
        .values({ id: b.id, ...changes })
        .onConflictDoUpdate({ target: books.id, set: changes, setWhere: lte(books.updatedAt, updatedAt) })
        .returning();

      if (row) {
        results.push(toBook(row));
        if (changes.coverUrl && changes.coverUrl.startsWith("http")) {
          queueCoverDownload(changes.coverUrl, b.id);
        }
      }
    }
    return { count: results.length, items: results };
  });

  app.get<{ Params: { filename: string } }>("/covers/:filename", async (request, reply) => {
    const filename = basename(request.params.filename);
    if (!coverExists(filename)) {
      return reply.code(404).send({ error: "Cover not found" });
    }
    const stream = createReadStream(getCoverFilePath(filename));
    return reply
      .header("content-type", "image/jpeg")
      .header("cache-control", "public, max-age=31536000, immutable")
      .send(stream);
  });

  app.post("/cache-covers", async () => {
    const count = await cacheAllMissingCovers();
    return { queued: count };
  });

  app.get<{ Querystring: { q: string } }>("/search", async (request) => {
    const results = await searchOpenLibrary(request.query.q || "");
    return { results };
  });

  app.get<{ Querystring: { isbn: string } }>("/isbn", async (request, reply) => {
    const result = await lookupOpenLibraryIsbn(request.query.isbn || "");
    if (!result) return reply.code(404).send({ error: "Book not found" });
    return result;
  });
}
