import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const journalCards = pgTable("journal_cards", {
  id: uuid().primaryKey(),
  date: text().notNull(),
  title: text().notNull(),
  content: text().notNull(),
  colorScheme: text().notNull().default("emerald"),
  tags: jsonb().$type<string[]>().default([]),
  imageUrl: text(),
  isPinned: boolean().notNull().default(false),
  sticker: text(),
  song: jsonb().$type<{ title: string; artist: string }>(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
