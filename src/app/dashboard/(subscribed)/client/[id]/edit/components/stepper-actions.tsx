"use client";
import { useCallback } from "react";
import { useServerAction } from "zsa-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import { steps } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/stepper-clickable";
import { updateClientOnboardingAction } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/actions";

// Takes: The current step value. {id: string, label: string}
export function StepperActions({ currentStep }: { currentStep: number }) {
  const {
    nextStep,
    prevStep,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  // Define the server action to update the Client onboarding status.
  const { execute } = useServerAction(updateClientOnboardingAction);

  // Make a new query string by adding a a key / value pair to the current searchParams.
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {!hasCompletedAllSteps && (
          <>
            <Button
              disabled={isDisabledStep}
              variant="outline"
              className="text-secondary"
              onClick={() => {
                prevStep();
                router.push(
                  pathname +
                    "?" +
                    createQueryString("step", steps[currentStep - 1].id)
                );
              }}
              size="sm"
            >
              Prev
            </Button>
            {isLastStep ? (
              <Button
                size="sm"
                onClick={async () => {
                  await execute({ clientId: +params.id });
                  router.push(`/dashboard/client/${params.id}/reporting`);
                }}
              >
                Finish
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-secondary"
                onClick={() => {
                  nextStep();
                  router.push(
                    pathname +
                      "?" +
                      createQueryString("step", steps[currentStep + 1].id)
                  );
                }}
              >
                {isOptionalStep ? "Skip" : "Next"}
              </Button>
            )}
            {!isLastStep && (
              <Button
                size="sm"
                onClick={async () => {
                  await execute({ clientId: +params.id });
                  router.push(`/dashboard/client/${params.id}/reporting`);
                }}
              >
                Finish
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
