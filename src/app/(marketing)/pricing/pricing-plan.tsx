"use client";

import { PricingTab } from "@/components/pricing-tab";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

// Takes: An optional plan string ("monthly" or "annually").
export default function Pricing({ plan }: { plan?: string }) {
  useEffect(() => {
    async function getStripePlanUrl() {
      // If a plan is provided:
      if (plan) {
        // Generate a Stripe checkout for the plan.
        const response = await fetch(`/api/stripe?plan=${plan}`);
        // Extract and redirect the user to the Stripe checkout URL.
        const data = await response.json();
        window.location.href = data.url;
      }
    }
    // On plan change, run checkout creation and redirection.
    getStripePlanUrl();
  }, [plan]);

  if (plan)
    return (
      <div className="space-y-2 px-8 pt-20 pb-4">
        <div className="flex items-center justify-center gap-3">
          <Loader2Icon className="h-12 w-12 animate-spin" />
          <span className="text-3xl font-bold"> Redirecting to Stripe...</span>
        </div>
        <div className="text-center">Please do not close the page.</div>
      </div>
    );

  return (
    <div className="px-8 pt-20 pb-4">
      <PricingTab />
    </div>
  );
}
