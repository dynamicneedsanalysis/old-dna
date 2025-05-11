import { NextResponse, type NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/lib/stripe/utils";
import { selectSubscription } from "@/db/queries/subscriptions";
import {
  CANCEL_URL,
  planSchema,
  RETURN_URL,
  SUCCESS_URL,
  type Plan,
} from "@/constants/stripe";

export async function GET(req: NextRequest) {
  try {
    // Get the user and return a 401 unauthorized error page if not found.
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get subscription and return a code 500 error page if an error occurs.
    const { subscription, error } = await selectSubscription({
      referenceId: user.id,
    });
    if (error instanceof Error) {
      console.error("[DB_ERROR]", error.message);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // If the user is subscribed, take them to the billing page.
    if (subscription && subscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: RETURN_URL,
      });
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // Get the Plan schema based on the Plan type from the URL.
    const url = new URL(req.url);
    const plan = planSchema.parse(url.searchParams.get("plan"));
    if (plan) {
      // Get user info for checkout creation.
      const customerEmail = user.email ?? "";
      const customerId = await getCustomerIdByEmail(customerEmail);

      // Go to the checkout page since its the user's first time
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "required",
        payment_method_collection: "if_required",
        allow_promotion_codes: true,
        line_items: createLineItems(plan),
        metadata: {
          userId: user.id,
        },
        // discounts: [{ promotion_code: "promo_1RNTpLDFg9lp4zTLdf4cjReT" }],
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: "pause",
            },
          },
        },
        ...(customerId
          ? { customer: customerId }
          : { customer_email: customerEmail }),
      });

      // On success, returning a stringified checkout session URL.
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }
  } catch (error) {
    // On error, return a code 500 error page.
    if (error instanceof Error) {
      console.error("[STRIPE_ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
}

// Takes: A Plan type.
// Returns: An array of line items based on the Plan type.
function createLineItems(plan: Plan) {
  switch (plan) {
    case "monthly":
      return [
        {
          price: process.env.MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ];
    case "annually":
      return [
        {
          price: process.env.ANNUAL_PRICE_ID,
          quantity: 1,
        },
      ];
  }
}

// Takes: An email string to find the associated customer ID.
// Returns: The customer ID if found, otherwise null.
async function getCustomerIdByEmail(email: string) {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    return customers.data.length > 0 ? customers.data[0].id : null;
  } catch (error) {
    console.error("Error retrieving customer:", error);
    throw error;
  }
}
