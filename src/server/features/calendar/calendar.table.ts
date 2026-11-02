import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const calendarEvents = pgTable("calendar_events", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  date: text().notNull(),
  time: text(),
  endTime: text(),
  category: text().notNull(),
  color: text().notNull().default("#10b981"),
  notes: text(),
  reminder: boolean().default(false),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
