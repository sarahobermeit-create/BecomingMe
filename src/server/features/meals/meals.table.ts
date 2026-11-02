import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const meals = pgTable("meals", {
  id: uuid().primaryKey(),
  date: text().notNull(),
  mealType: text().notNull(),
  title: text().notNull(),
  description: text(),
  calories: integer(),
  tags: jsonb().$type<string[]>().default([]),
  imageUrl: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
