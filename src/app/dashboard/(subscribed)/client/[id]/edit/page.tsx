import protectRoute from "@/lib/auth/protect-route";
import StepperForm from "@/app/dashboard/(subscribed)/client/[id]/edit/components/form";
import {
  StepperClickableSteps,
  type Step,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/components/stepper-clickable";

// Takes: A promise that resolves to an object with an Id string.
//        A promise that resolves to an object with an optional step string.
export default async function StepperPage(props: {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ step?: Step }>;
}) {
  // Extract step from searchParams and Id from params.
  const { step } = await props.searchParams;
  const params = await props.params;
  await protectRoute();
  const clientId = params.id;

  // If no step is provided, default to "client".
  const currentStep = step ?? "client";

  return (
    <div className="bg-navbar text-navbar-foreground min-h-[calc(100dvh-72px)] p-4">
      <StepperClickableSteps currentStep={currentStep}>
        <StepperForm clientId={clientId} currentStep={currentStep} />
      </StepperClickableSteps>
    </div>
  );
}
