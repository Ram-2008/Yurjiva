import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  sender: text("sender").notNull(),
  created: integer("created").notNull(),
  payload: text("payload").notNull(),
});
