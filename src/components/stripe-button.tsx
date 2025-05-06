"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Plan } from "@/constants/stripe";

interface StripeButtonProps extends ButtonProps {
  isSubscribed: boolean;
  plan?: Plan;
}

// Takes: A boolean for the subscription status and an optional Plan object.
export default function StripeButton({
  isSubscribed,
  plan,
  ...props
}: StripeButtonProps) {
  const [loading, setLoading] = useState(false);

  // Define subscription handler.
  const onSubscribe = async () => {
    try {
      setLoading(true);
      // Fetch the Plan from the Stripe API endpoint.
      // Creates a checkout session for the User.
      const response = await fetch(`/api/stripe?plan=${plan ?? ""}`);
      const data = await response.json();

      // Redirect to the Stripe checkout page.
      window.location.href = data.url;
    } catch (error) {
      if (error instanceof Error) {
        console.error("STRIPE_CLIENT_ERROR", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // If the User is not subscribed, return an option to see pricing.
  if (!isSubscribed) {
    return (
      <Link href="/pricing">
        <Button {...props}>See Pricing</Button>
      </Link>
    );
  }

  // Otherwise, return an option to manage the subscription.
  return (
    <Button onClick={onSubscribe} disabled={loading} {...props}>
      Manage Subscription
    </Button>
  );
}
