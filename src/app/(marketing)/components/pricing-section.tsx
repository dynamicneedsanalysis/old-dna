"use client";

import { Heading } from "@/components/ui/heading";
import { PricingTab } from "@/components/pricing-tab";

export function PricingSection() {
  return (
    <section id="pricing" className="space-y-14 px-4 pt-20 pb-32">
      <Heading
        variant="h1"
        className="text-center text-3xl font-bold tracking-tighter sm:text-4xl"
      >
        DNA Pricing Packages to Grow Your Business
      </Heading>

      <PricingTab />
    </section>
  );
}
