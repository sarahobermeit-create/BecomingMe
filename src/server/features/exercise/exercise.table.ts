import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workoutPlans = pgTable("workout_plans", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  category: text().notNull(),
  dayOfWeek: text(),
  durationMin: integer().notNull().default(0),
  exercises: jsonb().$type<any[]>().default([]),
  completedHistory: jsonb().$type<{ date: string; notes?: string }[]>().default([]),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
