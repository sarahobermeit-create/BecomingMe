import { asc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "#server/db.ts";
import { ideas } from "#server/features/ideas/ideas.table.ts";
import type { IdeaWrite, LifeIdea } from "#shared/ideas.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toIdea(row: typeof ideas.$inferSelect): LifeIdea {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as LifeIdea["category"],
    status: row.status as LifeIdea["status"],
    priority: row.priority as LifeIdea["priority"],
    targetDate: row.targetDate ?? undefined,
    actionItems: (row.actionItems as LifeIdea["actionItems"]) ?? [],
    tags: (row.tags as string[]) ?? [],
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function ideasRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(ideas)
      .where(isNull(ideas.deletedAt))
      .orderBy(asc(ideas.title));
    return rows.map(toIdea);
  });

  app.put<{ Params: { id: string }; Body: Omit<IdeaWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = new Date(Math.min(b.changedAt ?? Date.now(), Date.now()));
      const changes = {
        title: b.title,
        description: b.description,
        category: b.category,
        status: b.status,
        priority: b.priority,
        targetDate: b.targetDate,
        actionItems: b.actionItems,
        tags: b.tags,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(ideas)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: ideas.id, set: changes, setWhere: lte(ideas.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toIdea(row);
    },
  );
}
