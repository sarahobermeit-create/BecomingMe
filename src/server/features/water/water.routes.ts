import { desc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { waterLogs } from "#server/features/water/water.table.ts";
import type { WaterLog, WaterWrite } from "#shared/water.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toWater(row: typeof waterLogs.$inferSelect): WaterLog {
  return {
    id: row.id,
    date: row.date,
    amountMl: row.amountMl,
    targetMl: row.targetMl,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function waterRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(waterLogs)
      .where(isNull(waterLogs.deletedAt))
      .orderBy(desc(waterLogs.date));
    return rows.map(toWater);
  });

  app.put<{ Params: { id: string }; Body: Omit<WaterWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        date: b.date,
        amountMl: b.amountMl,
        targetMl: b.targetMl,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(waterLogs)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: waterLogs.id, set: changes, setWhere: lte(waterLogs.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toWater(row);
    },
  );
}
