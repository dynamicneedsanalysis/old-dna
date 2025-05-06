"use client";

import { moneyFormatter, formatPercentage } from "@/lib/utils";
import { calculateTotalCurrentValue } from "@/lib/asset/manager-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: An array of Assets and an array of Businesses.
export function AssetsTable({
  assets,
  businesses,
}: {
  assets: Asset[];
  businesses: Business[];
}) {
  const totalCurrentValue = calculateTotalCurrentValue(assets, businesses);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Current Value ($)</TableHead>
          <TableHead className="text-center">Appreciation Rate (%)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.length > 0 &&
          businesses.map((business) => (
            <AssetBusinessTableRow key={business.id} business={business} />
          ))}
        {assets.length > 0 &&
          assets?.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="text-center font-medium">
                {asset.name}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(parseFloat(asset.currentValue))}
              </TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(asset.rate))}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center">Total</TableCell>
          <TableCell className="text-center">
            {moneyFormatter.format(totalCurrentValue)}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

// Takes: A Business object.
function AssetBusinessTableRow({ business }: { business: Business }) {
  // Use the Business value and Client share to calculate and format the current value.
  const generateCurrentValue = () => {
    const valuation = parseFloat(business.valuation);
    const sharePercentage = parseFloat(business.clientSharePercentage) / 100;
    return moneyFormatter.format(valuation * sharePercentage);
  };
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{business.name}</TableCell>
      <TableCell className="text-center">{generateCurrentValue()}</TableCell>
      <TableCell className="text-center">
        {formatPercentage(parseFloat(business.appreciationRate))}
      </TableCell>
    </TableRow>
  );
}
