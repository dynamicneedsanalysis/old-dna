import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/utils";
import {
  insertSubscription,
  updateSubscription,
} from "@/db/queries/subscriptions";

export async function POST(req: Request) {
  // Get body and extract Stripe signature from headers.
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    // Create a Stripe event and session from the body and signature.
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const session = event.data.object as Stripe.Checkout.Session;

    console.log("MADE IT HERE");

    switch (event.type) {
      // On checkout completion, get the subscription and insert it into the database.
      case "checkout.session.completed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // If the User Id is not present, return an error instead of inserting the subscription.
        if (!session?.metadata?.userId) {
          return new NextResponse("User id is required", { status: 400 });
        }

        console.log("CREATE USER SUBSCRIPTION");

        // Create User subscription
        await insertSubscription({
          referenceId: session.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
        });
        break;
      }

      // On payment success, retrieve the newest Stripe subscription data and update the database subscription.
      case "invoice.payment_succeeded": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Update User subscription
        await updateSubscription(subscription.id, {
          stripePriceId: subscription.items.data[0].price.id,
        });
        break;
      }
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("WEB HOOK ERROR", error);
    if (error instanceof Error) {
      return new NextResponse(`Webhook Error ${error.message}`, {
        status: 400,
      });
    }
  }
}
