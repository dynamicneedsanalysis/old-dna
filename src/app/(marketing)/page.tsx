import { ContactUsSection } from "@/app/(marketing)/components/contact-us-section";
import { FeatureSection } from "@/app/(marketing)/components/feature-section";
import { HeroSection } from "@/app/(marketing)/components/hero-section";
import { TeamSection } from "@/app/(marketing)/components/team-section";
import { PricingSection } from "@/app/(marketing)/components/pricing-section";

export default async function IndexPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <TeamSection />
      <PricingSection />
      <ContactUsSection />
    </>
  );
}
