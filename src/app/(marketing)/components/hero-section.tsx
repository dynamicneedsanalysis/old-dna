"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import HeroImage from "@/app/(marketing)/images/hero.png";

export function HeroSection() {
  return (
    <section className="pt-6 pb-8 md:pt-6 lg:pt-32 lg:pb-16">
      <div className="container flex items-center gap-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <h1 className="balance text-3xl font-bold tracking-tighter sm:text-6xl md:text-center">
            Elevate your insights with the ultimate insurance calculator.
          </h1>
          <p className="balance sm:text-md text-muted-foreground mx-auto mt-4 max-w-2xl leading-normal font-medium sm:leading-8">
            Enhance your daily workflow as an advisor so you can deliver a
            personalized experience for your clients.
          </p>
          <p className="balance sm:text-md text-muted-foreground mx-auto mb-4 max-w-2xl leading-normal font-medium sm:leading-8">
            With DNA’s client profile tool, compliance metrics, AI-driven
            insights, and more, you can streamline your practice and focus on
            growth.
          </p>
          <div className="flex justify-center gap-2">
            <Link
              href="/contact-us"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full px-4 md:w-fit"
              )}
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-12 max-w-[1200px] overflow-hidden rounded-lg shadow-[0px_-24px_300px_0px_rgba(57,140,203,0.15)] transition hover:shadow-[0px_-24px_150px_0px_rgba(57,140,203,0.3)]">
        <Image
          src={HeroImage}
          alt="Hero Image"
          className="rounded-lg border object-cover"
          quality={100}
        />
      </div>
    </section>
  );
}
