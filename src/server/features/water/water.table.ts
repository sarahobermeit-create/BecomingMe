import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const waterLogs = pgTable("water_logs", {
  id: uuid().primaryKey(),
  date: text().notNull(),
  amountMl: integer().notNull().default(0),
  targetMl: integer().notNull().default(2500),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
