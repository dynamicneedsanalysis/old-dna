"use client";

import { moneyFormatter } from "@/lib/utils";
import {
  calculateAdditionalMoneyRequired,
  calculateBeneficiaryDistributions,
  calculateIdealDistributions,
  calculateTotalAdditionalMoneyRequired,
  calculateTotalIdealParts,
  calculateTotalLiquidAssets,
  calculateTotalPercentage,
} from "@/lib/asset/manager-utils";
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
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Takes: An array of Assets, an array of Beneficiaries, a tax freeze year,
//        A life expectancy value, and a life expectancy year.
export function BeneficiaryDistributionTable({
  assets,
  beneficiaries,
  taxFreezeYear,
  lifeExpectancy,
  lifeExpectancyYear,
}: {
  assets: Asset[];
  beneficiaries: Beneficiary[];
  taxFreezeYear: number;
  lifeExpectancy: number;
  lifeExpectancyYear: number;
}) {
  const currentYear = new Date().getFullYear();

  // Calculate the total distribution for the Beneficiaries of the Assets.
  const beneficiaryDistributions = calculateBeneficiaryDistributions(
    assets,
    taxFreezeYear,
    currentYear,
    lifeExpectancy,
    lifeExpectancyYear
  );

  // Calculate ideal distribution of Assets for each Beneficiary based on their allocations.
  const idealDistributions = calculateIdealDistributions(beneficiaries);

  // Use the total liquid value to find the amount required for each Beneficiary to reach their ideal distribution.
  const totalLiquidValue = calculateTotalLiquidAssets(assets);
  const additionalMoneyRequired = calculateAdditionalMoneyRequired(
    idealDistributions,
    beneficiaryDistributions,
    totalLiquidValue
  );

  // Use Beneficiary distributions to find the total future value of the current Assets.
  const totalFutureValue = Object.values(beneficiaryDistributions).reduce(
    (sum, amount) => sum + amount,
    0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Beneficiary</TableHead>
          <TableHead className="text-center">Amount ($)</TableHead>
          <TableHead className="text-center">Parts</TableHead>
          <TableHead className="text-center">
            Ideal Distribution (parts)
          </TableHead>
          <TableHead className="text-center">Additional Required ($)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(beneficiaryDistributions).map((name) => (
          <TableRow key={name}>
            <TableCell className="text-center font-medium">{name}</TableCell>
            <TableCell className="text-center">
              {moneyFormatter.format(beneficiaryDistributions[name])}
            </TableCell>
            <TableCell className="text-center">
              {Math.round(
                (beneficiaryDistributions[name] / totalFutureValue) * 100
              )}
            </TableCell>
            <TableCell className="text-center">
              {Math.round(idealDistributions[name])}
            </TableCell>
            <TableCell className="text-center">
              {moneyFormatter.format(additionalMoneyRequired[name] ?? 0)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center">Total</TableCell>
          <TableCell className="text-center">
            {moneyFormatter.format(totalFutureValue)}
          </TableCell>
          <TableCell className="text-center">
            {Math.round(
              calculateTotalPercentage(
                beneficiaryDistributions,
                totalFutureValue
              )
            )}
          </TableCell>
          <TableCell className="text-center">
            {Math.round(calculateTotalIdealParts(idealDistributions))}
          </TableCell>
          <TableCell className="text-center">
            {moneyFormatter.format(
              calculateTotalAdditionalMoneyRequired(additionalMoneyRequired)
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
