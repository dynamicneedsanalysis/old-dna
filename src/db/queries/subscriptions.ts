import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  subscriptions,
  type InsertSubscription,
} from "@/db/schema/subscriptions";
import { mightFail } from "@/lib/utils";

const selectSubscriptionQuery = db
  .select()
  .from(subscriptions)
  .where(eq(subscriptions.referenceId, sql.placeholder("referenceId")))
  .prepare("get_single_subscription");

// Takes: A Kinde Id.
// Finds the Subscription with the given Kinde Id.
// Returns: The Subscription data and the nullable error result.
export async function selectSubscription({
  referenceId,
}: {
  referenceId: string;
}) {
  const { data, error } = await mightFail(() =>
    selectSubscriptionQuery.execute({ referenceId }).then((rows) => rows[0])
  );
  return { subscription: data, error };
}

// Takes: An Insert Subscription object.
// Inserts a new Subscription with the given Insert Subscription data.
// Returns: The nullable error result.
export async function insertSubscription(subscription: InsertSubscription) {
  console.log("INSERTING THIS", subscription);

  const { error } = await mightFail(
    async () =>
      await db.insert(subscriptions).values({
        referenceId: subscription.referenceId,
        stripeCustomerId: subscription.stripeCustomerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
      })
  );

  console.log("DID WE PASS", error);

  return { error };
}

// Takes: A Subscription Id and an Insert Subscription object.
// Updates the Subscription with matching Id with the Insert Subscription data.
// Returns: The nullable error result.
export async function updateSubscription(
  subscriptionId: string,
  subscription: Partial<
    Pick<InsertSubscription, "referenceId" | "seats" | "stripePriceId">
  >
) {
  const { error } = await mightFail(
    async () =>
      await db
        .update(subscriptions)
        .set({
          referenceId: subscription.referenceId,
          seats: subscription.seats,
          stripePriceId: subscription.stripePriceId,
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
  );
  return { error };
}

export async function deleteSubscription(
  referenceId: string,
  subscriptionId: string
) {
  const { error } = await mightFail(
    async () =>
      await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.stripeSubscriptionId, subscriptionId),
            eq(subscriptions.referenceId, referenceId)
          )
        )
  );
  return { error };
}
