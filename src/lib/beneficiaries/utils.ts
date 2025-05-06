import { toCamelCase } from "@/lib/utils";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Takes: An array of Beneficiaries.
// Returns: An array of the Beneficiaries and their totaled allocation.
export function generateDesiredBeneficiaryDistribution(
  beneficiaries: Beneficiary[]
): { desiredBeneficiary: string; allocation: number }[] {
  const beneficiaryTotals: Record<string, number> = {};

  // Sum and record the allocation for each Beneficiary.
  beneficiaries.forEach((beneficiary): void => {
    if (!beneficiaryTotals[beneficiary.name]) {
      beneficiaryTotals[beneficiary.name] = 0;
    }
    beneficiaryTotals[beneficiary.name] += parseFloat(beneficiary.allocation);
  });

  // Convert the Beneficiary Totals to an array of Beneficiaries and their allocation.
  const desiredBeneficiaries = Object.keys(beneficiaryTotals).map((bt) => {
    return {
      desiredBeneficiary: bt,
      allocation: parseFloat(beneficiaryTotals[bt].toFixed(1)),
    };
  });

  return desiredBeneficiaries;
}

// Takes: An array of Assets.
// Finds the total distribution for the Beneficiary in each Asset.
// Distribution = Asset Value * Beneficiary Allocation / Sum of all Beneficiary Allocations.
// Returns: An array of the Beneficiaries and their totaled distribution across all the Assets.
export function generateRealBeneficiaryDistribution(
  assets: Asset[]
): { realBeneficiary: string; allocation: number }[] {
  const beneficiaryTotals: Record<string, number> = {};

  // Iterate over each Asset to calculate the distribution for each Beneficiary.
  assets.forEach((asset) => {
    const assetValue = parseFloat(asset.currentValue);
    // Find sum of all Beneficiary Allocations in the Asset.
    const sumParts = asset.assetBeneficiaries.reduce(
      (sum, ab) => sum + parseFloat(ab.allocation),
      0
    );

    // For each Beneficiary in the Asset, calculate the distribution.
    asset.assetBeneficiaries.forEach((assetBeneficiary) => {
      if (assetBeneficiary && assetBeneficiary.beneficiaries) {
        const beneficiaryName = assetBeneficiary.beneficiaries.name;
        const beneficiaryPart = parseFloat(assetBeneficiary.allocation);

        // Calculate the distribution and add it to a total for the Beneficiary.
        const assetValueDistribution =
          (assetValue * beneficiaryPart) / sumParts;

        if (!beneficiaryTotals[beneficiaryName]) {
          beneficiaryTotals[beneficiaryName] = 0;
        }
        beneficiaryTotals[beneficiaryName] += assetValueDistribution;
      }
    });
  });

  // Convert the Beneficiary Totals to an array of Beneficiaries and their distribution.
  const realBeneficiaries = Object.keys(beneficiaryTotals).map((bt) => {
    return {
      realBeneficiary: bt,
      allocation: parseFloat(beneficiaryTotals[bt].toFixed(1)),
    };
  });

  return realBeneficiaries;
}

// Takes: An array of Assets and a life expectancy year.
// Calculate the distribution of Beneficiaries including the life expectancy in the calculation.
// Returns: An array of the Beneficiaries and their totaled distribution across all the Assets.
//          Value calculations include the future value of the Asset at the life expectancy year.
export function generateRealBeneficiaryLifeExpectancyDistribution(
  assets: Asset[],
  lifeExpectancyYear: number
): { realBeneficiary: string; allocation: number }[] {
  const beneficiaryTotals: Record<string, number> = {};
  const currentYear = new Date().getFullYear();

  assets.forEach((asset) => {
    const yearsToLifeExpectancy = lifeExpectancyYear - currentYear;
    // Determine the assets future value at the life expectancy year.
    const assetValue =
      parseFloat(asset.currentValue) *
      Math.pow(1 + parseFloat(asset.rate) / 100, yearsToLifeExpectancy);

    // Find sum of all Beneficiary Allocations in the Asset.
    const sumParts = asset.assetBeneficiaries.reduce(
      (sum, ab) => sum + parseFloat(ab.allocation),
      0
    );

    // For each Beneficiary in the Asset, calculate the distribution.
    asset.assetBeneficiaries.forEach((assetBeneficiary) => {
      if (assetBeneficiary && assetBeneficiary.beneficiaries) {
        const beneficiaryName = assetBeneficiary.beneficiaries.name;
        const beneficiaryPart = parseFloat(assetBeneficiary.allocation);

        // Calculate the distribution and add it to a total for the Beneficiary.
        const assetValueDistribution =
          (assetValue * beneficiaryPart) / sumParts;

        if (!beneficiaryTotals[beneficiaryName]) {
          beneficiaryTotals[beneficiaryName] = 0;
        }
        beneficiaryTotals[beneficiaryName] += assetValueDistribution;
      }
    });
  });

  // Convert the Beneficiary Totals to an array of Beneficiaries and their distribution.
  const realBeneficiaries = Object.keys(beneficiaryTotals).map((bt) => {
    return {
      realBeneficiary: bt,
      allocation: parseFloat(beneficiaryTotals[bt].toFixed(1)),
    };
  });

  return realBeneficiaries;
}

// Takes: An array of Assets.
// For each Asset, generates an array of objects connecting Beneficiaries to their Asset distribution.
// Returns: An array of objects: {Asset: Asset name, Beneficiary Name: distributions}
export function generateAssetValueDistribution(assets: Asset[]): {
  [key: string]: string | number;
}[] {
  const result: { [key: string]: string | number }[] = [];
  const beneficiaryNames: Set<string> = new Set();

  // Collect all unique Beneficiary names
  assets.forEach((asset) => {
    asset.assetBeneficiaries.forEach((assetBeneficiary) => {
      if (assetBeneficiary.beneficiaries) {
        beneficiaryNames.add(assetBeneficiary.beneficiaries.name);
      }
    });
  });

  // Create an entry for each Asset.
  assets.forEach((asset) => {
    const entry: { [key: string]: string | number } = {
      asset: asset.name,
    };

    // Find the Asset value and calculate the sum of all Beneficiary parts.
    const assetValue = parseFloat(asset.currentValue);
    const sumParts = asset.assetBeneficiaries.reduce(
      (sum, ab) => sum + parseFloat(ab.allocation),
      0
    );

    // Calculate and record the distribution for each Beneficiary.
    beneficiaryNames.forEach((beneficiaryName) => {
      const beneficiary = asset.assetBeneficiaries.find(
        (b) => b.beneficiaries?.name === beneficiaryName
      );

      if (beneficiary) {
        const beneficiaryPart = parseFloat(beneficiary.allocation);
        const distribution = (assetValue * beneficiaryPart) / sumParts;
        entry[toCamelCase(beneficiaryName)] = parseFloat(
          distribution.toFixed(1)
        );
      }
    });

    // Add the Asset entry to the result array.
    result.push(entry);
  });

  return result;
}
