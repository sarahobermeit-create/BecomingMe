import { asc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { hobbies } from "#server/features/hobbies/hobbies.table.ts";
import type { Hobby, HobbyWrite } from "#shared/hobbies.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toHobby(row: typeof hobbies.$inferSelect): Hobby {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    level: row.level as Hobby["level"],
    hoursSpent: row.hoursSpent,
    targetWeeklyHours: row.targetWeeklyHours,
    currentProject: row.currentProject ?? undefined,
    milestones: (row.milestones as Hobby["milestones"]) ?? [],
    notes: row.notes ?? undefined,
    icon: row.icon ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function hobbiesRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(hobbies)
      .where(isNull(hobbies.deletedAt))
      .orderBy(asc(hobbies.name));
    return rows.map(toHobby);
  });

  app.put<{ Params: { id: string }; Body: Omit<HobbyWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        name: b.name,
        category: b.category,
        level: b.level,
        hoursSpent: b.hoursSpent,
        targetWeeklyHours: b.targetWeeklyHours,
        currentProject: b.currentProject,
        milestones: b.milestones,
        notes: b.notes,
        icon: b.icon,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(hobbies)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: hobbies.id, set: changes, setWhere: lte(hobbies.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toHobby(row);
    },
  );
}
