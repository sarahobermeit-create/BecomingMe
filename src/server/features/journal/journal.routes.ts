import { desc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { journalCards } from "#server/features/journal/journal.table.ts";
import type { JunkJournalCard, JunkJournalWrite } from "#shared/journal.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toCard(row: typeof journalCards.$inferSelect): JunkJournalCard {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    content: row.content,
    colorScheme: row.colorScheme as JunkJournalCard["colorScheme"],
    tags: (row.tags as string[]) ?? [],
    imageUrl: row.imageUrl ?? undefined,
    isPinned: row.isPinned,
    sticker: row.sticker ?? undefined,
    song: (row.song as JunkJournalCard["song"]) ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function journalRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(journalCards)
      .where(isNull(journalCards.deletedAt))
      .orderBy(desc(journalCards.date), desc(journalCards.createdAt));
    return rows.map(toCard);
  });

  app.put<{ Params: { id: string }; Body: Omit<JunkJournalWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        date: b.date,
        title: b.title,
        content: b.content,
        colorScheme: b.colorScheme,
        tags: b.tags,
        imageUrl: b.imageUrl,
        isPinned: b.isPinned ?? false,
        sticker: b.sticker,
        song: b.song,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(journalCards)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({
          target: journalCards.id,
          set: changes,
          setWhere: lte(journalCards.updatedAt, updatedAt),
        })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toCard(row);
    },
  );
}
