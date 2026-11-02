import { asc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { workoutPlans } from "#server/features/exercise/exercise.table.ts";
import type { WorkoutPlan, WorkoutWrite } from "#shared/exercise.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toWorkout(row: typeof workoutPlans.$inferSelect): WorkoutPlan {
  return {
    id: row.id,
    title: row.title,
    category: row.category as WorkoutPlan["category"],
    dayOfWeek: row.dayOfWeek ?? undefined,
    durationMin: row.durationMin,
    exercises: (row.exercises as WorkoutPlan["exercises"]) ?? [],
    completedHistory: (row.completedHistory as WorkoutPlan["completedHistory"]) ?? [],
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function exerciseRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(workoutPlans)
      .where(isNull(workoutPlans.deletedAt))
      .orderBy(asc(workoutPlans.title));
    return rows.map(toWorkout);
  });

  app.put<{ Params: { id: string }; Body: Omit<WorkoutWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        title: b.title,
        category: b.category,
        dayOfWeek: b.dayOfWeek,
        durationMin: b.durationMin,
        exercises: b.exercises,
        completedHistory: b.completedHistory,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(workoutPlans)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: workoutPlans.id, set: changes, setWhere: lte(workoutPlans.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toWorkout(row);
    },
  );
}
