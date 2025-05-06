import Pricing from "@/app/(marketing)/pricing/pricing-plan";

// Takes: A promise that resolves to an object with a plan string ("monthly" or "annually").
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan: string | undefined }>;
}) {
  const { plan } = await searchParams;
  return <Pricing plan={plan} />;
}
