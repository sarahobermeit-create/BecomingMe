import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const budgetTransactions = pgTable("budget_transactions", {
  id: uuid().primaryKey(),
  date: text().notNull(),
  type: text().notNull(),
  category: text().notNull(),
  amount: integer().notNull(),
  title: text().notNull(),
  notes: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
