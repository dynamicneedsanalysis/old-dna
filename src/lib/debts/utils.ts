import { toCamelCase } from "@/lib/utils";
import type { Debt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";

// Takes: A Debt object and the year to calculate to.
// Returns 0 if the year is before the year acquired or if the Debt is paid off.
// Otherwise, calculate and return the remaining Debt value.
function calculateDebtValueAtYear(debt: Debt, year: number): number {
  const yearsHeld = year - debt.yearAcquired;
  if (yearsHeld < 0) return 0;

  const initialValue = parseFloat(debt.initialValue);
  const annualPayment = parseFloat(debt.annualPayment);
  const interestRate = parseFloat(debt.rate) / 100;

  // Compound interest component
  const compoundInterest = initialValue * Math.pow(1 + interestRate, yearsHeld);

  // Payment reduction component
  const paymentReduction =
    (annualPayment * (Math.pow(1 + interestRate, yearsHeld) - 1)) /
    interestRate;

  // Determine and return the remaining Debt.
  const remainingDebt = compoundInterest - paymentReduction;
  return Math.max(0, remainingDebt);
}

// Takes: An array of Debt objects.
// Use a reduce loop to sum the current value of all Debts.
// Returns: The total current value of all Debts.
export function calculateTotalCurrentValueOfDebtDollars(debts: Debt[]): number {
  const currentYear = new Date().getFullYear();
  return debts.reduce((total, debt) => {
    const currentValueOfDebtDollars = calculateDebtValueAtYear(
      debt,
      currentYear
    );
    return total + currentValueOfDebtDollars;
  }, 0);
}

// Takes: The Debts and a life expectancy year.
// Calculates the Debts for each year from the first year a Debt was acquired to the life expectancy year.
// Returns: An array objects connecting years to an array of Debts and values.
export function generateDebts(
  debts: Debt[],
  lifeExpectancyYear: number
): { [debtName: string]: string | number; year: string }[] {
  if (debts.length === 0) return [];

  // Define min and max years, and the Debt names.
  let minYear = Infinity;
  const maxYear = lifeExpectancyYear;
  const debtNames: string[] = [];

  // Find the values for minYear, maxYear, and Debt Names.
  for (const debt of debts) {
    minYear = Math.min(minYear, debt.yearAcquired);
    debtNames.push(toCamelCase(debt.name));
  }

  const yearCount = maxYear - minYear + 1;
  const result: { year: string; [debtName: string]: number | string }[] =
    new Array(yearCount);

  // Pre-allocate year objects
  for (let i = 0; i < yearCount; i++) {
    result[i] = { year: (minYear + i).toString() };
  }

  // Calculate Debt values
  for (let i = 0; i < debts.length; i++) {
    // Get the next Debt and Debt name.
    const debt = debts[i];
    const debtName = debtNames[i];
    // Set year to the year acquired and index to the number of years after minYear.
    // Year is absolute value for calculation and index is location the the results array.
    let year = debt.yearAcquired;
    let index = year - minYear;

    while (index < yearCount) {
      const value = calculateDebtValueAtYear(debt, year);
      // Stop if the Debt is paid off.
      if (value <= 0) break;

      // Record the value to the year and Debt name, the increment year and index.
      result[index][debtName] = value;
      year++;
      index++;
    }
  }

  // Remove empty years
  return result.filter((entry) => Object.keys(entry).length > 1);
}
