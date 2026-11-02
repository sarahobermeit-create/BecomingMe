import { and, asc, eq, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { books } from "#server/features/books/books.table.ts";
import type { Book, BookWrite, ExternalBookInfo } from "#shared/books.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toBook(row: typeof books.$inferSelect): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    status: row.status as Book["status"],
    format: (row.format ?? undefined) as Book["format"],
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
    sortOrder: row.sortOrder ?? undefined,
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
        title: b.title,
        author: b.author,
        status: b.status,
        format: b.format,
        totalPages: b.totalPages,
        currentPage: b.currentPage,
        audioDurationMinutes: b.audioDurationMinutes,
        currentAudioMinutes: b.currentAudioMinutes,
        rating: b.rating,
        coverUrl: b.coverUrl,
        startDate: b.startDate,
        finishDate: b.finishDate,
        favoriteQuotes: b.favoriteQuotes,
        notes: b.notes,
        sortOrder: b.sortOrder,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(books)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: books.id, set: changes, setWhere: lte(books.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
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
        title: b.title,
        author: b.author,
        status: b.status,
        format: b.format,
        totalPages: b.totalPages,
        currentPage: b.currentPage,
        audioDurationMinutes: b.audioDurationMinutes,
        currentAudioMinutes: b.currentAudioMinutes,
        rating: b.rating,
        coverUrl: b.coverUrl,
        startDate: b.startDate,
        finishDate: b.finishDate,
        favoriteQuotes: b.favoriteQuotes,
        notes: b.notes,
        sortOrder: b.sortOrder,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(books)
        .values({ id: b.id, ...changes })
        .onConflictDoUpdate({ target: books.id, set: changes, setWhere: lte(books.updatedAt, updatedAt) })
        .returning();

      if (row) results.push(toBook(row));
    }
    return { count: results.length, items: results };
  });

  app.get<{ Querystring: { q: string } }>("/search", async (request, reply) => {
    const q = request.query.q?.trim();
    if (!q) return { results: [] };
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8&fields=title,author_name,cover_i,number_of_pages_median,first_publish_year,isbn`;
      const res = await fetch(url, { headers: { "User-Agent": "LifeApp/1.0" } });
      if (!res.ok) return { results: [] };
      const data = (await res.json()) as { docs?: Array<Record<string, unknown>> };
      const results: ExternalBookInfo[] = (data.docs || []).map((d) => {
        const isbnArr = Array.isArray(d.isbn) ? (d.isbn as string[]) : [];
        const authorArr = Array.isArray(d.author_name) ? (d.author_name as string[]) : [];
        const coverI = d.cover_i as number | undefined;
        return {
          title: String(d.title || ""),
          author: authorArr.join(", "),
          totalPages: Number(d.number_of_pages_median) || 300,
          coverUrl: coverI
            ? `https://covers.openlibrary.org/b/id/${coverI}-L.jpg`
            : isbnArr[0]
              ? `https://covers.openlibrary.org/b/isbn/${isbnArr[0]}-L.jpg`
              : "",
          publishYear: d.first_publish_year ? String(d.first_publish_year) : undefined,
          isbn: isbnArr[0],
        };
      });
      return { results };
    } catch (err) {
      request.log.error(err, "Open Library search error");
      return reply.code(502).send({ error: "Failed to search books" });
    }
  });

  app.get<{ Querystring: { isbn: string } }>("/isbn", async (request, reply) => {
    const isbnRaw = request.query.isbn?.trim().replace(/[^0-9X]/gi, "");
    if (!isbnRaw) return reply.code(400).send({ error: "Invalid ISBN" });
    try {
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbnRaw}&format=json&jscmd=data`;
      const res = await fetch(url, { headers: { "User-Agent": "LifeApp/1.0" } });
      if (!res.ok) return reply.code(404).send({ error: "Book not found" });
      const data = (await res.json()) as Record<string, any>;
      const item = data[`ISBN:${isbnRaw}`];
      if (!item) return reply.code(404).send({ error: "Book not found" });
      const authors = Array.isArray(item.authors) ? item.authors.map((a: { name: string }) => a.name).join(", ") : "";
      const coverUrl =
        item.cover?.large || item.cover?.medium || `https://covers.openlibrary.org/b/isbn/${isbnRaw}-L.jpg`;
      const result: ExternalBookInfo = {
        title: String(item.title || ""),
        author: authors,
        totalPages: Number(item.number_of_pages) || 300,
        coverUrl,
        publishYear: item.publish_date ? String(item.publish_date) : undefined,
        isbn: isbnRaw,
        description: typeof item.description === "string" ? item.description : item.description?.value,
        quote: item.excerpts?.[0]?.text,
      };
      return result;
    } catch (err) {
      request.log.error(err, "Open Library ISBN error");
      return reply.code(502).send({ error: "Failed to lookup ISBN" });
    }
  });
}
