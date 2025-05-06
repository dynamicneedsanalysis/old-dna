import { Assets } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/assets";
import { Beneficiaries } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/beneficiaries";
import { Businesses } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/businesses";
import { Client } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/client/client";
import { Debts } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/debts";
import { Goals } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/goals";
import { KeyPeople } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/key-people";
import { Shareholders } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/shareholders";
import type { Step } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/stepper-clickable";

export default function StepperForm({
  clientId,
  currentStep,
}: {
  clientId: number;
  currentStep: Step;
}) {
  switch (currentStep) {
    case "client":
      return <Client clientId={clientId} />;
    case "beneficiaries":
      return <Beneficiaries clientId={clientId} />;
    case "assets":
      return <Assets clientId={clientId} />;
    case "debts":
      return <Debts clientId={clientId} />;
    case "businesses":
      return (
        <div className="space-y-4 px-2">
          <Businesses clientId={clientId} />
          <Shareholders clientId={clientId} />
          <KeyPeople clientId={clientId} />
        </div>
      );
    case "goals":
      return <Goals clientId={clientId} />;
    default:
      return null;
  }
}
