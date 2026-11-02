import { asc, isNull, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { parseChangedAt } from "#server/dates.ts";
import { db } from "#server/db.ts";
import { calendarEvents } from "#server/features/calendar/calendar.table.ts";
import type { CalendarEvent, CalendarWrite } from "#shared/calendar.ts";

const idParams = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "string", format: "uuid" } },
} as const;

function toEvent(row: typeof calendarEvents.$inferSelect): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time ?? undefined,
    endTime: row.endTime ?? undefined,
    category: row.category as CalendarEvent["category"],
    color: row.color,
    notes: row.notes ?? undefined,
    reminder: row.reminder ?? false,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function calendarRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const rows = await db
      .select()
      .from(calendarEvents)
      .where(isNull(calendarEvents.deletedAt))
      .orderBy(asc(calendarEvents.date), asc(calendarEvents.time));
    return rows.map(toEvent);
  });

  app.put<{ Params: { id: string }; Body: Omit<CalendarWrite, "id"> }>(
    "/:id",
    { schema: { params: idParams } },
    async (request, reply) => {
      const b = request.body;
      const updatedAt = parseChangedAt(b.changedAt);
      const changes = {
        title: b.title,
        date: b.date,
        time: b.time,
        endTime: b.endTime,
        category: b.category,
        color: b.color,
        notes: b.notes,
        reminder: b.reminder ?? false,
        updatedAt,
        ...(b.deleted && { deletedAt: updatedAt }),
      };

      const [row] = await db
        .insert(calendarEvents)
        .values({ id: request.params.id, ...changes })
        .onConflictDoUpdate({
          target: calendarEvents.id,
          set: changes,
          setWhere: lte(calendarEvents.updatedAt, updatedAt),
        })
        .returning();

      if (!row) return reply.code(409).send({ error: "Item changed after this write was made" });
      return toEvent(row);
    },
  );
}
