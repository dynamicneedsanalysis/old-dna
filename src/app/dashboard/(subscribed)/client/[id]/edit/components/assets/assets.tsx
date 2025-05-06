import { notFound } from "next/navigation";
import { getUser } from "@/lib/kinde";
import { Heading } from "@/components/ui/heading";
import { selectAllBeneficiaries, selectSingleClient } from "@/db/queries/index";
import { AssetsTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/assets-table";
import { TaxFreezeAtYearEdit } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/tax-freeze-at-year-edit";
import { AssetDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/asset-dialog";

// Takes: A Client Id number.
export async function Assets({ clientId }: { clientId: number }) {
  const user = await getUser();

  // Get the Client and handle errors.
  const { client, error: clientError } = await selectSingleClient({
    id: clientId,
    kindeId: user.id,
  });
  if (clientError) {
    throw clientError;
  }
  if (!client) {
    notFound();
  }

  // Fetch all Beneficiaries for the Client.
  const { beneficiaries, error } = await selectAllBeneficiaries(clientId);
  if (error) {
    throw error;
  }
  if (!beneficiaries) {
    notFound();
  }

  // Map Beneficiaries to Asset Beneficiaries.
  const assetBeneficiaries = beneficiaries.map((b) => ({
    id: b.id,
    name: b.name,
    allocation: parseFloat(b.allocation),
    alreadyAssigned: true,
  }));

  return (
    <>
      <Heading variant="h1">Assets</Heading>
      <AssetDialog mode="add" beneficiaries={assetBeneficiaries} />
      <div className="max-h-[calc(100dvh-72px-350px)] overflow-auto">
        <AssetsTable clientId={clientId} beneficiaries={beneficiaries} />
      </div>
      <TaxFreezeAtYearEdit clientId={clientId} />
    </>
  );
}
