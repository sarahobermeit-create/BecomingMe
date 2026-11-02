import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ideas = pgTable("ideas", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  status: text().notNull().default("spark"),
  priority: text().notNull().default("medium"),
  targetDate: text(),
  actionItems: jsonb().$type<{ id: string; text: string; done: boolean }[]>().default([]),
  tags: jsonb().$type<string[]>().default([]),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
