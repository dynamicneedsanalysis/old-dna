import { moneyFormatter, roundNumericToNearestWholeNumber } from "@/lib/utils";
import { consolidateAndMarkBeneficiaryAllocations } from "@/lib/asset/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectAllAssets } from "@/db/queries/index";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import { DeleteAssetButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/delete-asset-button";
import { AssetDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/asset-dialog";

// Takes: A Client Id number and an array of Beneficiaries.
// Omit "createdAt" and "clientId" from the Beneficiary objects.
export async function AssetsTable({
  clientId,
  beneficiaries,
}: {
  clientId: number;
  beneficiaries: Omit<Beneficiary, "createdAt" | "clientId">[];
}) {
  // Fetch all Assets for the Client.
  const { assets, error } = await selectAllAssets(clientId);
  if (error) {
    throw error;
  }

  // Calculate the total purchase price and current value of all Assets.
  const totalPurchasePrice = assets?.reduce(
    (acc, asset) => acc + parseFloat(asset.initialValue),
    0
  );
  const totalCurrentValue = assets?.reduce(
    (acc, asset) => acc + parseFloat(asset.currentValue),
    0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Year Acquired</TableHead>
          <TableHead className="text-center">Purchase Price</TableHead>
          <TableHead className="text-center">Current Value ($)</TableHead>
          <TableHead className="text-center">Time Horizon</TableHead>
          <TableHead className="text-right"></TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets?.map((asset) => (
          <AssetTableRow
            key={asset.id}
            asset={asset}
            beneficiaries={beneficiaries}
          />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center font-semibold">Total</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-center font-semibold">
            {moneyFormatter.format(totalPurchasePrice || 0)}
          </TableCell>
          <TableCell className="text-center font-semibold">
            {moneyFormatter.format(totalCurrentValue || 0)}
          </TableCell>
          <TableCell colSpan={3}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

// Takes: An Asset object and an array of Beneficiaries.
//        Beneficiaries values "Created At" and "Client Id" are omitted.
function AssetTableRow({
  asset,
  beneficiaries,
}: {
  asset: Asset;
  beneficiaries: Omit<Beneficiary, "createdAt" | "clientId">[];
}) {
  const { assetBeneficiaries: assignedAssetBeneficiaries, ...assetDetails } =
    asset;

  // Get consolidated Beneficiaries from the passed Beneficiaries and Asset Beneficiaries.
  const consolidatedBeneficiaries = consolidateAndMarkBeneficiaryAllocations(
    beneficiaries,
    assignedAssetBeneficiaries
  );

  return (
    <TableRow>
      <TableCell className="text-center font-semibold">{asset.name}</TableCell>
      <TableCell className="text-center">{asset.yearAcquired}</TableCell>
      <TableCell className="text-center">
        {moneyFormatter.format(parseFloat(asset.initialValue))}
      </TableCell>
      <TableCell className="text-center">
        {moneyFormatter.format(parseFloat(asset.currentValue))}
      </TableCell>
      <TableCell className="text-center">
        {asset.term
          ? `${roundNumericToNearestWholeNumber(asset.term)} years`
          : "-"}
      </TableCell>
      <TableCell>
        <AssetDialog
          mode="edit"
          asset={assetDetails}
          beneficiaries={consolidatedBeneficiaries}
        />
      </TableCell>
      <TableCell className="text-right">
        <DeleteAssetButton id={asset.id} />
      </TableCell>
    </TableRow>
  );
}
