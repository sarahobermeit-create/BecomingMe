import { and, asc, eq, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { routines } from "#server/features/routines/routines.table.ts";
import type { RoutineItem, RoutineWrite } from "#shared/routines.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toRoutine(row: typeof routines.$inferSelect): RoutineItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as RoutineItem["category"],
    time: row.time ?? undefined,
    completedDates: (row.completedDates as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    sortOrder: row.sortOrder ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function routinesRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(routines)
      .where(isNull(routines.deletedAt))
      .orderBy(asc(routines.sortOrder), asc(routines.createdAt));
    return rows.map(toRoutine);
  });

  app.get<{ Params: { id: string } }>("/:id", { schema: { params: idParams } }, async (request, reply) => {
    const [row] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, request.params.id), isNull(routines.deletedAt)));
    if (!row) return reply.code(404).send({ error: "Routine not found" });
    return toRoutine(row);
  });

  app.put<{ Params: { id: string }; Body: Omit<RoutineWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        title: b.title,
        category: b.category,
        time: b.time,
        completedDates: b.completedDates,
        tags: b.tags,
        sortOrder: b.sortOrder,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(routines)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: routines.id, set: changes, setWhere: lte(routines.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toRoutine(row);
    },
  );
}
