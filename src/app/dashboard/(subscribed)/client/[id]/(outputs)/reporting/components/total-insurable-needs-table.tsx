import { notFound } from "next/navigation";
import { moneyFormatter } from "@/lib/utils";
import {
  calculateBeneficiaryDistributions,
  calculateIdealDistributions,
  calculateAdditionalMoneyRequired,
  calculateTotalAdditionalMoneyRequired,
  calculateTotalLiquidAssets,
} from "@/lib/asset/manager-utils";
import {
  calculateInsuredIncomeAmount,
  calculateLifeExpectancyYear,
} from "@/lib/client/utils";
import { calculateTotalCurrentValueOfDebtDollars } from "@/lib/debts/utils";
import {
  calculateTotalSumGoals,
  calculateSurplusShortfall,
} from "@/lib/goals/utils";
import {
  calculateTaxBurden,
  calculateTotalCapitalGains,
  calculateWant,
} from "@/lib/total-needs/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  selectAllAssetsWithBeneficiaries,
  selectAllBeneficiaries,
  selectAllDebts,
  selectAllGoals,
} from "@/db/queries/index";
import type { Client } from "@/app/dashboard/(subscribed)/clients/lib/schema";
import type { BusinessKeyPeopleShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/businesses";
import { selectAllTotalInsurableNeeds } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/queries/total-insurable-needs";
import { TotalInsurableNeedsRow } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/total-insurable-needs-row";

// Takes: A Client and an array of BusinessKeyPeopleShareholders objects.
export async function TotalInsurableNeedsTable({
  client,
  businesses,
}: {
  client: Client;
  businesses: BusinessKeyPeopleShareholders[];
}) {
  // Get Client properties.
  const [
    { goals, error: goalError },
    { assets, error: assetError },
    { beneficiaries, error: beneficiaryError },
    { debts, error: debtError },
    { totalInsurableNeeds, error: totalInsurableNeedsError },
  ] = await Promise.all([
    selectAllGoals(client.id),
    selectAllAssetsWithBeneficiaries(client.id),
    selectAllBeneficiaries(client.id),
    selectAllDebts(client.id),
    selectAllTotalInsurableNeeds(client.id),
  ]);

  // If any errors are present, throw the first error.
  if (
    goalError ||
    assetError ||
    beneficiaryError ||
    debtError ||
    totalInsurableNeedsError
  ) {
    throw (
      goalError ||
      assetError ||
      beneficiaryError ||
      debtError ||
      totalInsurableNeedsError
    );
  }

  // If any Client properties are missing, throw a 404.
  if (!goals || !assets || !beneficiaries || !debts || !totalInsurableNeeds) {
    notFound();
  }

  // Find the insurable amount and total sum of goals.
  const insuredIncome = calculateInsuredIncomeAmount(
    parseFloat(client.annualIncome),
    client.age
  );
  const totalSumGoals = calculateTotalSumGoals(goals || []);

  // Calculate any additional liquidity after allocating to the sum of goals.
  const goalShortfall = calculateSurplusShortfall(
    parseFloat(client.liquidityAllocatedTowardsGoals),
    totalSumGoals
  );

  const currentYear = new Date().getFullYear();
  const lifeExpectancyYear = calculateLifeExpectancyYear(
    client.age,
    client.lifeExpectancy
  );

  // Get a record of Beneficiaries to their distributions.
  const beneficiaryDistributions = calculateBeneficiaryDistributions(
    assets,
    lifeExpectancyYear,
    currentYear,
    client.lifeExpectancy,
    lifeExpectancyYear
  );

  // Get the total value of all liquid Assets and the ideal distributions of Beneficiaries (their allocation value).
  const totalLiquidValue = calculateTotalLiquidAssets(assets);
  const idealDistributions = calculateIdealDistributions(beneficiaries);

  // Calculate and sum the additional money required for each Beneficiary to meet their ideal distributions.
  const additionalMoneyRequired = calculateAdditionalMoneyRequired(
    idealDistributions,
    beneficiaryDistributions,
    totalLiquidValue
  );
  const totalAdditionalMoneyRequired = calculateTotalAdditionalMoneyRequired(
    additionalMoneyRequired
  );

  // Calculate the total current value of all Debts.
  const totalCurrentValueOfDebtDollars =
    calculateTotalCurrentValueOfDebtDollars(debts);

  // Calculate the total capital gains and tax burden at the tax freeze year.
  const totalCapitalGains = calculateTotalCapitalGains(
    assets,
    businesses,
    client.taxFreezeAtYear,
    client.lifeExpectancy
  );
  const taxBurdenAtTaxFreezeYear = calculateTaxBurden(
    totalCapitalGains,
    client.province
  );

  // Defines a need value based on a passed purpose.
  const getNeed = (purpose: string) => {
    switch (purpose) {
      case "Income Replacement":
        return insuredIncome;
      case "Tax Burden":
        return taxBurdenAtTaxFreezeYear;
      case "Equalization":
        return totalAdditionalMoneyRequired;
      case "Debt Current Liability":
        return totalCurrentValueOfDebtDollars;
      case "Goal Shortfall":
        return Math.abs(goalShortfall);
      default:
        return 0;
    }
  };

  // Get the total need and want values for all insurable needs.
  const totalNeed = totalInsurableNeeds.reduce(
    (acc, cur) => acc + getNeed(cur.purpose),
    0
  );
  const totalWant = totalInsurableNeeds.reduce(
    (acc, cur) => acc + calculateWant(getNeed(cur.purpose), cur.priority),
    0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Purpose</TableHead>
          <TableHead>Need</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Want</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {totalInsurableNeeds.map((item) => (
          <TotalInsurableNeedsRow
            key={item.id}
            item={item}
            need={getNeed(item.purpose)}
          />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{moneyFormatter.format(totalNeed)}</TableCell>
          <TableCell></TableCell>
          <TableCell>{moneyFormatter.format(totalWant)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
