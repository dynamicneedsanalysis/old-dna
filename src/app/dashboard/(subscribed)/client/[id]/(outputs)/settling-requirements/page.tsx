import { Heading } from "@/components/ui/heading";
import { getSettlingRequirements } from "./queries";
import { SettlingRequirementsForm } from "./settling-requirements-form";

// Takes: A promise that resolves to the Client Id.
export default async function SettlingRequirementsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const settingRequirements = await getSettlingRequirements(id);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Heading>Settling Requirements Checklist</Heading>
      <SettlingRequirementsForm
        settlingRequirements={settingRequirements}
        clientId={id}
      />
    </div>
  );
}
