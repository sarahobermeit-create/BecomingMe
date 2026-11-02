import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const routines = pgTable("routines", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  category: text().notNull().default("daily"),
  time: text(),
  completedDates: jsonb().$type<string[]>().notNull().default([]),
  tags: jsonb().$type<string[]>().notNull().default([]),
  sortOrder: integer().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
