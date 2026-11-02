import { desc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "#server/db.ts";
import { budgetTransactions } from "#server/features/budget/budget.table.ts";
import type { Transaction, TransactionWrite } from "#shared/budget.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toTransaction(row: typeof budgetTransactions.$inferSelect): Transaction {
  return {
    id: row.id,
    date: row.date,
    type: row.type as Transaction["type"],
    category: row.category,
    amount: row.amount,
    title: row.title,
    notes: row.notes ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function budgetRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(budgetTransactions)
      .where(isNull(budgetTransactions.deletedAt))
      .orderBy(desc(budgetTransactions.date), desc(budgetTransactions.createdAt));
    return rows.map(toTransaction);
  });

  app.put<{ Params: { id: string }; Body: Omit<TransactionWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = new Date(Math.min(b.changedAt ?? Date.now(), Date.now()));
      const changes = {
        date: b.date,
        type: b.type,
        category: b.category,
        amount: b.amount,
        title: b.title,
        notes: b.notes,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(budgetTransactions)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({
          target: budgetTransactions.id,
          set: changes,
          setWhere: lte(budgetTransactions.updatedAt, updatedAt),
        })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toTransaction(row);
    },
  );
}
