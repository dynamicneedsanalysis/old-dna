import Stripe from "stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { selectSubscription } from "@/db/queries/subscriptions";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const checkSubscription = async () => {
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();
  console.log("==============");
  console.log("CHECKING SUBSCRIPTION", user);
  if (!user) {
    return false;
  }

  // Get User subscription
  const { subscription, error } = await selectSubscription({
    referenceId: user.id,
  });

  console.log("SELECTED SUBSCRIPTION", subscription);
  console.log("SELECTED SUBSCRIPTION ERROR", error);

  if (error instanceof Error) {
    console.error("[DB_ERROR]", error.message);
    return false;
  }

  if (!subscription) {
    console.log("NO SUB");
    const org = await getOrganization();

    console.log("HERE IS MY ORG", org);

    if (!org || !org.orgCode) {
      return false;
    }

    const { subscription: orgSub, error: orgSubError } =
      await selectSubscription({
        referenceId: org.orgCode,
      });

    console.log("ORG SUB", orgSub);
    console.log("ORG SUB ERROR", orgSubError);

    if (orgSubError instanceof Error) {
      console.error("[DB_ERROR]", orgSubError.message);
      return false;
    }

    if (!orgSub) {
      return false;
    }

    const stripeOrgSubscription = await stripe.subscriptions.retrieve(
      orgSub.stripeSubscriptionId
    );

    console.log("STRIPE ORG SUBBBBB", stripeOrgSubscription);

    return !!(
      orgSub.stripePriceId && stripeOrgSubscription.status === "active"
    );
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );
  console.log("THIS IS MY STRIPE SUBSCRIPTION", stripeSubscription);

  // Check if the subscription is active
  const isValid =
    subscription.stripePriceId && stripeSubscription.status === "active";

  console.log("IS VALID", isValid);

  return !!isValid;
};
