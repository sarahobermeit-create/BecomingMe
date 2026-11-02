import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const moodEntries = pgTable("mood_entries", {
  id: uuid().primaryKey(),
  date: text().notNull(),
  score: integer().notNull(),
  energyLevel: integer().notNull(),
  label: text().notNull(),
  factors: jsonb().$type<string[]>().default([]),
  journalNote: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
