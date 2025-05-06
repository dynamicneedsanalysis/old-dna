"use client";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Step, type StepItem, Stepper } from "@/components/ui/stepper";
import { StepperActions } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/stepper-actions";

export const steps = [
  { id: "client", label: "Client Info" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "assets", label: "Assets" },
  { id: "debts", label: "Debt" },
  { id: "businesses", label: "Businesses" },
  { id: "goals", label: "Goals & Philanthropy" },
] as const satisfies StepItem[];

export type Step = (typeof steps)[number]["id"];

// Takes: A Step object. {id: string, label: string}
export function StepperClickableSteps({
  currentStep,
  children,
}: {
  currentStep: Step;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Make a new query string by adding a a key / value pair to the current searchParams.
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Find the index of the current Step in the steps array.
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        initialStep={currentStepIndex}
        steps={steps}
        onClickStep={(step, setStep) => {
          const nextStep = steps[step].id;
          router.push(pathname + "?" + createQueryString("step", nextStep));
          setStep(step);
        }}
        styles={{
          "step-button-container": cn(
            "data-[current=true]:bg-yellow-500 data-[current=true]:border-secondary data-[current=true]:hover:text-secondary-foreground data-[current=true]:hover:bg-primary/90",
            "data-[active=true]:bg-yellow-500 data-[active=true]:border-yellow-500"
          ),
          "horizontal-step":
            "data-[completed=true]:not-last:after:bg-yellow-500",
        }}
      >
        {steps.map((stepProps) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className="bg-card text-secondary my-2 flex min-h-[calc(100dvh-72px-350px)] items-center justify-center rounded-md border p-6 px-2 md:min-h-[calc(100dvh-72px-220px)]">
                <div className="max-h-[calc(100dvh-72px-270px)] w-[calc(100dvw-100px)] max-w-4xl overflow-auto text-black md:w-full">
                  {children}
                </div>
              </div>
            </Step>
          );
        })}
        <StepperActions currentStep={currentStepIndex} />
      </Stepper>
    </div>
  );
}
