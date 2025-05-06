import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { documents } from "@/db/schema/documents";
import type { selectAllDocuments } from "@/db/queries/index";

// Schema for inserting a User - can be used to validate API requests
export const insertDocumentsSchema = createInsertSchema(documents);

// Define and export a type for the schema created by the insertDocumentsSchema function.
export type InsertDocument = z.infer<typeof insertDocumentsSchema>;

// Define and export a type based on the success result of the All Documents function.
export type Document = NonNullable<
  Awaited<ReturnType<typeof selectAllDocuments>>["documents"]
>[number];
