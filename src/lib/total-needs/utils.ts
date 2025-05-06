import { calculateValueAtYear } from "@/lib/utils";
import { findSelectedBracket } from "@/lib/client/utils";
import type { ProvinceInitials } from "@/constants/index";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: The need and priority of a Key Person, Shareholder, or Total Insurable Need.
// Returns: Want as a percentage.
// Throws an instead error if need or priority are invalid values.
export function calculateWant(need: number, priority: number): number {
  if (need < 0 || priority < 0 || priority > 100) {
    throw new Error(
      "Need and priority must be positive, and priority must be less than or equal to 100"
    );
  }
  const priorityInDecimal = priority / 100;
  return need * priorityInDecimal;
}

// Takes: The total capital gains and the province.
// Returns: The tax burden based on the tax brackets for that province.
export function calculateTaxBurden(
  totalCapitalGains: number,
  province: ProvinceInitials
): number {
  const taxRate = calculateCapitalGainsTaxBracket(province, totalCapitalGains);
  return totalCapitalGains <= 250000
    ? totalCapitalGains * 0.5 * taxRate
    : 250000 * 0.5 * taxRate + (totalCapitalGains - 250000) * 0.67 * taxRate;
}

// Takes: The Assets, the Businesses, the province, the year of life expectancy, and the life expectancy.
// Calculates the tax burden based on capital gains for a span of years based on the life expectancy year.
// Returns: A record of years to tax burdens.
export function generateTaxBurdenSeries(
  assets: Asset[],
  businesses: Business[],
  province: ProvinceInitials,
  lifeExpectancyYear: number,
  lifeExpectancy: number
): Record<string, number | string>[] {
  const taxSeries: Record<string, number | string>[] = [];

  // Combine Assets and Businesses and find the start and end year
  const allEntities = [...assets, ...businesses];
  const startYear = Math.min(
    ...allEntities.map((entity) => entity.yearAcquired)
  );
  const endYear = lifeExpectancyYear;

  // For each year, calculate the total capital gains to find the tax burden.
  for (let year = startYear; year <= endYear; year++) {
    const totalCapitalGains = calculateTotalCapitalGains(
      assets,
      businesses,
      year,
      lifeExpectancy
    );

    const taxBurden = calculateTaxBurden(totalCapitalGains, province);

    // Add a record of the year and the tax burden to the tax series.
    taxSeries.push({ year: year.toString(), taxBurden: taxBurden });
  }

  return taxSeries;
}

// Takes: An Asset, the year, and the life expectancy.
// Calculates value at the given year and finds the capital gains.
// Returns: The capital gains for that Asset. (value at year - initial value).
export function calculateAssetCapitalGains(
  asset: Asset,
  yearGiven: number,
  lifeExpectancy: number
): number {
  // If the Asset is not taxable, return 0
  if (!asset.isTaxable) {
    return 0;
  }

  const valueAtYear = calculateValueAtYear(asset, yearGiven, lifeExpectancy);
  const capitalGains = valueAtYear - parseFloat(asset.initialValue);
  return capitalGains;
}

// Takes: A Business, the year, and the life expectancy.
// Calculates value at the given year and finds the capital gains.
// Returns: The capital gains for that Business.(value at year - purchase price).
export function calculateBusinessCapitalGains(
  business: Business,
  yearGiven: number,
  lifeExpectancy: number
): number {
  const valueAtYear = calculateValueAtYear(business, yearGiven, lifeExpectancy);
  const capitalGains = valueAtYear - parseFloat(business.purchasePrice);
  return capitalGains;
}

// Takes: The Assets, the Businesses, the year, and the life expectancy.
// Sums the capital gains from Assets and Businesses for that year.
// Returns: The total capital gains for that year.
export function calculateTotalCapitalGains(
  assets: Asset[],
  businesses: Business[],
  yearGiven: number,
  lifeExpectancy: number
): number {
  let totalCapitalGains = 0;

  // Calculate capital gains from Assets
  if (assets) {
    for (const asset of assets) {
      totalCapitalGains += calculateAssetCapitalGains(
        asset,
        yearGiven,
        lifeExpectancy
      );
    }
  }

  // Calculate capital gains from Businesses
  if (businesses) {
    for (const business of businesses) {
      totalCapitalGains += calculateBusinessCapitalGains(
        business,
        yearGiven,
        lifeExpectancy
      );
    }
  }

  return Math.max(0, totalCapitalGains);
}

// Takes: The province and the capital gains.
// Returns: The tax rate for that bracket in that province as a percentage.
export function calculateCapitalGainsTaxBracket(
  province: ProvinceInitials,
  capitalGains: number
): number {
  const { taxRate } = findSelectedBracket(province, capitalGains);
  return taxRate / 100;
}

// Takes: The Assets, the Businesses, the province, and the life expectancy.
// Calculates the tax burden based on capital gains for a span of years based on the term end dates.
// Returns: A record of years to the taxed amount on the capital gains. <year, tax on capital gains>
export function generateCapitalGainsTaxSeries(
  assets: Asset[],
  businesses: Business[],
  province: ProvinceInitials,
  lifeExpectancy: number
): { year: number; tax: number }[] {
  const taxSeries: { year: number; tax: number }[] = [];

  // Combine Assets and Businesses and find the start and end year
  const allEntities = [...assets, ...businesses];
  const currentYear = new Date().getFullYear();
  const startYear = Math.min(
    ...allEntities.map((entity) => entity.yearAcquired)
  );

  // Find the furthest date in the future, that the term of the entity concludes as the end year.
  const endYear = Math.max(
    ...allEntities.map(
      (entity) =>
        currentYear + (entity.term ? Math.min(20, parseFloat(entity.term)) : 0)
    )
  );

  // For each year, calculate the total capital gains and tax rate to find the tax burden.
  for (let year = startYear; year <= endYear; year++) {
    const totalCapitalGains = calculateTotalCapitalGains(
      assets,
      businesses,
      year,
      lifeExpectancy
    );
    const taxRate = calculateCapitalGainsTaxBracket(
      province,
      totalCapitalGains
    );

    const taxAmount = totalCapitalGains * taxRate;

    // Add a record of the year and the tax burden to the tax series.
    taxSeries.push({ year, tax: taxAmount });
  }

  return taxSeries;
}
