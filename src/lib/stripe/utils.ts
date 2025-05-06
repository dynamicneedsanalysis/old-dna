import Stripe from "stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { selectSubscription } from "@/db/queries/subscriptions";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const checkSubscription = async () => {
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return false;
  }

  // Get User subscription
  const { subscription, error } = await selectSubscription({
    referenceId: user.id,
  });

  if (error instanceof Error) {
    console.error("[DB_ERROR]", error.message);
    return false;
  }

  if (!subscription) {
    const org = await getOrganization();

    if (!org || !org.orgCode) {
      return false;
    }

    const { subscription: orgSub, error: orgSubError } =
      await selectSubscription({
        referenceId: org.orgCode,
      });

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

    return !!(
      orgSub.stripePriceId && stripeOrgSubscription.status === "active"
    );
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  // Check if the subscription is active
  const isValid =
    subscription.stripePriceId && stripeSubscription.status === "active";

  return !!isValid;
};
