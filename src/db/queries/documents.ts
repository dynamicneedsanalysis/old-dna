import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { documents } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertIllustrations } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/lib/types";
import type { InsertDocument } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/lib/types";

const selectAllDocumentsQuery = db
  .select({
    id: documents.id,
    clientId: documents.clientId,
    kindeId: documents.kindeId,
    file: {
      name: documents.fileName,
      size: documents.fileSize,
      url: documents.fileUrl,
    },
    createdAt: documents.createdAt,
  })
  .from(documents)
  .where(
    and(
      eq(documents.clientId, sql.placeholder("clientId")),
      eq(documents.kindeId, sql.placeholder("userId"))
    )
  )
  .orderBy(desc(documents.createdAt))
  .prepare("get_all_documents");

// Takes: A Client Id and a User Id.
// Selects all Documents for a given Client Id and User Id.
// Returns: The Documents and the nullable error value.
export async function selectAllDocuments(clientId: number, userId: string) {
  const { data, error } = await mightFail(() =>
    selectAllDocumentsQuery.execute({ clientId, userId })
  );
  return { documents: data, error };
}

// Takes: An Insert Document object.
// Inserts the Insert Document into the database.
// Returns: The new Document's Id and the nullable error value.
export async function insertDocument(document: InsertDocument) {
  const { data, error } = await mightFail(() =>
    db
      .insert(documents)
      .values(document)
      .returning({ id: documents.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Document Id and an Insert Illustrations file name.
// Updates the matching Document with the new file name.
// Returns: The nullable error value.
export async function updateDocument(
  id: number,
  fileName: InsertIllustrations["fileName"]
) {
  const { error } = await mightFail(() =>
    db
      .update(documents)
      .set({
        fileName,
      })
      .where(eq(documents.id, id))
  );
  return { error };
}

const deleteDocumentQuery = db
  .delete(documents)
  .where(
    and(
      eq(documents.id, sql.placeholder("id")),
      eq(documents.clientId, sql.placeholder("clientId")),
      eq(documents.kindeId, sql.placeholder("userId"))
    )
  )
  .returning({ id: documents.id, fileKey: documents.fileKey })
  .prepare("delete_single_document");

// Takes: A Document Id, a Client Id, and a User Id.
// Deletes the matching Document with the given Id, Client Id, and User Id.
// Returns: The deleted Document object with the Id and file key, and the nullable error value.
export async function deleteDocument({
  id,
  clientId,
  userId,
}: {
  id: number;
  clientId: number;
  userId: string;
}) {
  const { data, error } = await mightFail(() =>
    deleteDocumentQuery.execute({ id, clientId, userId }).then((res) => res[0])
  );
  return {
    data,
    error,
  };
}
