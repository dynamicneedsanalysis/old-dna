"use client";

interface Feature {
  feature: string;
  description: string;
}

// Define an array of Feature objects.
// { feature: string, description: string }
const features: Feature[] = [
  {
    feature: "Client Management",
    description:
      "Consolidate your customer data into individual profiles enabling effective management and a curated experience for the client.",
  },
  {
    feature: "AI Support",
    description:
      "Leverage an LLQP and CLU trained AI model for policy recommendations, second opinions, and client help-desk support.",
  },
  {
    feature: "Regulatory Compliance",
    description:
      "Ensure your state/provincial and federal compliance requirements are met through DNA’s checklist and auto-generation document procedures.",
  },
  {
    feature: "Advisor Trainings",
    description:
      "Train both new and old advisors on various life insurance policy illustrations to optimize their learning experience and maximize efficiency.",
  },
  {
    feature: "Comprehensive Analysis",
    description:
      "Calculate premiums, deductibles, and coverage limits for various insurance policies based on client-specific information and needs.",
  },
  {
    feature: "Data Security",
    description:
      "Securely store client data through state-of-the-art encryption and compliance as regulated by North American data protection laws.",
  },
];

export function FeatureSection() {
  return (
    <section
      id="features"
      className="bg-navbar space-y-6 py-8 md:py-12 lg:py-24 dark:bg-transparent"
    >
      <div className="text-navbar-foreground mx-auto mb-14 flex max-w-4xl flex-col items-center space-y-6 text-center">
        <h2 className="text-3xl leading-[1.1] font-bold">
          Everything you need to succeed as an insurance advisor.
        </h2>
        <p className="text-md font-base max-w-[85%] leading-normal text-slate-300 sm:leading-7">
          The DNA platform streamlines the entire calculation process, offering
          a quick and accurate policy recommendation in just a few clicks.
        </p>
        <p className="text-md font-base max-w-[85%] leading-normal text-slate-300 sm:leading-7">
          Spend less time crunching numbers and more time providing valuable
          insights to your clients.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 px-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.feature}
            className="bg-background relative overflow-hidden rounded-lg border p-2"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">{f.feature}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
