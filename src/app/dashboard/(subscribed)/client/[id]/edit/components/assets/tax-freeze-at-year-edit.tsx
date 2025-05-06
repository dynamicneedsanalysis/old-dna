import { notFound } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { selectTaxFreezeAtYearAndLifeExpectancy } from "@/db/queries/index";
import { EditTaxFreezeAtYearDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/edit-tax-freeze-at-year-dialog";

// Takes: A Client Id number.
export async function TaxFreezeAtYearEdit({ clientId }: { clientId: number }) {
  // Get Client tax freeze year related values.
  const { client, error } =
    await selectTaxFreezeAtYearAndLifeExpectancy(clientId);

  if (error) {
    throw error;
  }

  if (!client) {
    return notFound();
  }
  return (
    <div className="flex w-[300px] flex-col gap-2">
      <StatCard
        description="Tax Freeze At Year"
        value={client.taxFreezeAtYear}
      />
      <EditTaxFreezeAtYearDialog client={client} />
    </div>
  );
}
