"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function ContactUsSection() {
  return (
    <section className="bg-navbar text-navbar-foreground py-8 md:py-12 lg:py-24 dark:bg-transparent">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4">
        <h2 className="balance text-3xl font-bold tracking-tighter sm:text-6xl md:text-center">
          30-Day Money-Back Guarantee
        </h2>
        <p className="balance sm:text-md mx-auto my-4 max-w-2xl leading-normal font-medium text-slate-300 sm:leading-8">
          If you are unsatisfied with your purchase, contact us in the first 30
          days and we will give you a full refund.
        </p>
        <Link
          href="/contact-us"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mx-auto w-full px-4 md:w-fit"
          )}
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
