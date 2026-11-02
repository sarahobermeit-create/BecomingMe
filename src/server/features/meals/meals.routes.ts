import { desc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { meals } from "#server/features/meals/meals.table.ts";
import type { MealLogItem, MealWrite } from "#shared/meals.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toMeal(row: typeof meals.$inferSelect): MealLogItem {
  return {
    id: row.id,
    date: row.date,
    mealType: row.mealType as MealLogItem["mealType"],
    title: row.title,
    description: row.description ?? undefined,
    calories: row.calories ?? undefined,
    tags: (row.tags as string[]) ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(meals)
      .where(isNull(meals.deletedAt))
      .orderBy(desc(meals.date), desc(meals.createdAt));
    return rows.map(toMeal);
  });

  app.put<{ Params: { id: string }; Body: Omit<MealWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        date: b.date,
        mealType: b.mealType,
        title: b.title,
        description: b.description,
        calories: b.calories,
        tags: b.tags,
        imageUrl: b.imageUrl,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(meals)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({ target: meals.id, set: changes, setWhere: lte(meals.updatedAt, updatedAt) })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toMeal(row);
    },
  );
}
