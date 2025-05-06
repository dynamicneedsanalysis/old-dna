import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "@/db/schema/index";

export const illustrations = pgTable("illustrations", {
  id: serial("id").primaryKey(),
  policyName: text("policy_name").notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  carrier: text("carrier").notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  kindeId: text("kinde_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
