import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { illustrations } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertIllustrations } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/lib/types";

const selectAllIllustrationsQuery = db
  .select({
    id: illustrations.id,
    clientId: illustrations.clientId,
    kindeId: illustrations.kindeId,
    carrier: illustrations.carrier,
    policyName: illustrations.policyName,
    file: {
      name: illustrations.fileName,
      size: illustrations.fileSize,
      url: illustrations.fileUrl,
    },
    createdAt: illustrations.createdAt,
  })
  .from(illustrations)
  .where(
    and(
      eq(illustrations.clientId, sql.placeholder("clientId")),
      eq(illustrations.kindeId, sql.placeholder("userId"))
    )
  )
  .orderBy(desc(illustrations.createdAt))
  .prepare("get_all_illustrations");

// Takes: A Client Id and a User Id.
// Selects all Illustrations for a given Client Id and User Id.
// Returns: The Illustrations and the nullable error value.
export async function selectAllIllustrations(clientId: number, userId: string) {
  const { data, error } = await mightFail(() =>
    selectAllIllustrationsQuery.execute({ clientId, userId })
  );
  return { illustrations: data, error };
}

// Takes: An Insert Illustrations object.
// Inserts the Insert Illustrations object into the database.
// Returns: The new Illustrations Id and the nullable error value.
export async function insertIllustration(illustration: InsertIllustrations) {
  const { data, error } = await mightFail(() =>
    db
      .insert(illustrations)
      .values(illustration)
      .returning({ id: illustrations.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: An Illustrations Id and an Insert Illustrations file name.
// Updates the matching Illustrations object in the database with the new file name.
// Returns: The nullable error value.
export async function updateIllustration(
  id: number,
  policyName: InsertIllustrations["policyName"]
) {
  const { error } = await mightFail(() =>
    db
      .update(illustrations)
      .set({
        policyName,
      })
      .where(eq(illustrations.id, id))
  );
  return { error };
}

const deleteIllustrationQuery = db
  .delete(illustrations)
  .where(
    and(
      eq(illustrations.id, sql.placeholder("id")),
      eq(illustrations.clientId, sql.placeholder("clientId")),
      eq(illustrations.kindeId, sql.placeholder("userId"))
    )
  )
  .returning({ id: illustrations.id, fileKey: illustrations.fileKey })
  .prepare("delete_single_illustration");

// Takes: An Illustrations Id, a Client Id, and a User Id.
// Deletes the Illustrations object from the database.
// Returns: The Id and file key of the deleted Illustration and the nullable error value.
export async function deleteIllustration({
  id,
  clientId,
  userId,
}: {
  id: number;
  clientId: number;
  userId: string;
}) {
  const { data, error } = await mightFail(() =>
    deleteIllustrationQuery
      .execute({ id, clientId, userId })
      .then((res) => res[0])
  );
  return {
    data,
    error,
  };
}
