import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const hobbies = pgTable("hobbies", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  category: text().notNull(),
  level: text().notNull().default("Beginner"),
  hoursSpent: integer().notNull().default(0),
  targetWeeklyHours: integer().notNull().default(0),
  currentProject: text(),
  milestones: jsonb().$type<{ id: string; title: string; completed: boolean }[]>().default([]),
  notes: text(),
  icon: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
