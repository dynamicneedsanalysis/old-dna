import { calculateValueAtYear, toCamelCase } from "@/lib/utils";
import type {
  Asset,
  AssetBeneficiary,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: An array of Assets and an array of Businesses.
// Returns: An array of the Asset types and their total values.
export function generateDiversification(
  assets: Asset[],
  businesses: Business[]
): { assetType: string; value: number }[] {
  const totalByType: Record<string, number> = {};

  // For each Asset, add the value to the total of its Asset type.
  // If the Asset type does not exist, create it with a value of 0 and add the Asset value.
  assets.forEach((asset): void => {
    totalByType[asset.type] =
      (totalByType[asset.type] || 0) + parseFloat(asset.currentValue);
  });

  // Convert the total by type to an array of Asset types and their total values.
  const assetDiversification = Object.keys(totalByType).map((t) => {
    return {
      assetType: t,
      value: parseFloat(totalByType[t].toFixed(1)),
    };
  });

  if (businesses && businesses.length > 0) {
    // Calculate the value of all Client Businesses.
    const totalBusinesses = businesses?.reduce((total, business) => {
      const valuation = parseFloat(business.valuation);
      const sharePercentage = parseFloat(business.clientSharePercentage);

      // Calculate this Business's value based on valuation and the Client's share percentage.
      const businessValue = valuation * (sharePercentage / 100);

      return total + businessValue;
    }, 0);

    // Record the total value of all Businesses a new Asset type.
    const businessesDiversification = {
      assetType: "Businesses",
      value: totalBusinesses,
    };

    assetDiversification.push(businessesDiversification);
  }

  return assetDiversification;
}

// Takes: An array of Assets, a life expectancy year, and a life expectancy.
// Returns: An array of years with an array of the Assets and their values at that year.
export function generateNetWorth(
  assets: Asset[],
  lifeExpectancyYear: number,
  lifeExpectancy: number
): { year: string; [key: string]: number | string }[] {
  const currentYear = new Date().getFullYear();
  // Find the earliest year an Asset was acquired as the starting year.
  const startYear: number = Math.min(...assets.map((a) => a.yearAcquired));
  const endYear: number = lifeExpectancyYear;

  const result: { year: string; [key: string]: number | string }[] = [];

  // Iterate through the years from the start year to the life expectancy year.
  for (let year = startYear; year <= endYear; year++) {
    // Add a record for the current year to the results.
    const yearData: { year: string; [key: string]: number | string } = {
      year: year.toString(),
    };

    // For each Asset, calculate its value at the current year and record it.
    // Skip any Assets that have not been acquired yet or whose term has expired.
    assets.forEach((asset) => {
      const term = asset.term
        ? Math.min(20, parseFloat(asset.term))
        : lifeExpectancy + 5;

      if (year >= asset.yearAcquired && year <= currentYear + term) {
        yearData[toCamelCase(asset.name)] = calculateValueAtYear(
          asset,
          year,
          lifeExpectancy
        );
      }
    });

    result.push(yearData);
  }

  result.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  return result;
}

// Takes: An array of Assets and the life expectancy.
// Returns: The total net worth of the Assets at the current year.
export function calculateTotalNetWorthForCurrentYear(assets: Asset[]): number {
  const currentNetWorth = assets.reduce(
    (sum, value) => sum + parseFloat(value.currentValue),
    0
  );
  return currentNetWorth;
}

// Takes: An array of Beneficiaries and an array of AssetBeneficiaries.
//        Beneficiaries array omit the createdAt and clientId fields.
// Returns: An array of objects with the Beneficiary's Id, name, allocation, and assignment state.
export function consolidateAndMarkBeneficiaryAllocations(
  originalBeneficiaries: Omit<Beneficiary, "createdAt" | "clientId">[],
  assetBeneficiaries: AssetBeneficiary[]
): {
  alreadyAssigned: boolean;
  allocation: number;
  id: number;
  name: string;
}[] {
  // Map over Beneficiaries, mark them as unassigned and set an allocation value of 0.
  const beneficiaries = originalBeneficiaries.map((b) => ({
    ...b,
    alreadyAssigned: false,
    allocation: 0,
  }));

  // Map over the Asset Beneficiaries and record the allocation value to the Beneficiary Id.
  const assetBeneficiariesMap = new Map(
    assetBeneficiaries.map((b) => [b.beneficiaryId, parseFloat(b.allocation)])
  );

  // For each Beneficiary, check if their Id is in the Asset Beneficiaries map.
  // Then set the allocation of the Beneficiary and mark them as assigned.
  return beneficiaries.map((b) => {
    if (assetBeneficiariesMap.has(b.id)) {
      b.allocation = assetBeneficiariesMap.get(b.id) || b.allocation;
      b.alreadyAssigned = true;
    }
    return b;
  });
}
