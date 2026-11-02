import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  author: text().notNull(),
  status: text().notNull().default("want_to_read"),
  format: text().default("physical"),
  totalPages: integer().notNull().default(0),
  currentPage: integer().notNull().default(0),
  audioDurationMinutes: integer(),
  currentAudioMinutes: integer(),
  rating: integer(),
  coverUrl: text(),
  startDate: text(),
  finishDate: text(),
  favoriteQuotes: jsonb().$type<string[]>(),
  notes: text(),
  sortOrder: integer().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
