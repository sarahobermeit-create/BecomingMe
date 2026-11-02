import { desc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "#server/db.ts";
import { moodEntries } from "#server/features/mood/mood.table.ts";
import type { MoodEntry, MoodWrite } from "#shared/mood.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toMood(row: typeof moodEntries.$inferSelect): MoodEntry {
  return {
    id: row.id,
    date: row.date,
    score: row.score as MoodEntry["score"],
    energyLevel: row.energyLevel,
    label: row.label,
    factors: (row.factors as string[]) ?? [],
    journalNote: row.journalNote ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function moodRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(moodEntries)
      .where(isNull(moodEntries.deletedAt))
      .orderBy(desc(moodEntries.date));
    return rows.map(toMood);
  });

  app.put<{ Params: { id: string }; Body: Omit<MoodWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = new Date(Math.min(b.changedAt ?? Date.now(), Date.now()));
      const changes = {
        date: b.date,
        score: b.score,
        energyLevel: b.energyLevel,
        label: b.label,
        factors: b.factors,
        journalNote: b.journalNote,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(moodEntries)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: moodEntries.id, set: changes, setWhere: lte(moodEntries.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toMood(row);
    },
  );
}
