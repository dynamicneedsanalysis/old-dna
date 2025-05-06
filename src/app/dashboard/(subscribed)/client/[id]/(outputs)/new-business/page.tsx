import { getNewBusiness } from "./queries";
import { Heading } from "@/components/ui/heading";
import { NewBusinessForm } from "./new-business-form";

// Takes: The promise that resolves to the Client Id.
export default async function NewBusinessPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const newBusiness = await getNewBusiness(id);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Heading>New Business Checklist</Heading>
      <NewBusinessForm newBusiness={newBusiness} clientId={id} />
    </div>
  );
}
