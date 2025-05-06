import {
  type ProvinceInitials,
  TAX_BRACKETS,
  type TaxBracket,
} from "@/constants/index";

// Calculate the exact number of years from a birth date (day inclusive).
export function calculateAgeFromDate(birthDate: Date): number {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 0) {
    throw new Error("Age cannot be negative");
  }

  const month = today.getMonth();
  const birthMonth = birthDate.getMonth();
  const day = today.getDate();
  const birthDay = birthDate.getDate();

  if (month < birthMonth || (month === birthMonth && day < birthDay)) {
    return age - 1;
  }
  return age;
}

// Takes: A province and an annual income.
// Returns: The appropriate tax bracket for the province and income.
export function findSelectedBracket(
  province: ProvinceInitials,
  annualIncome: number
): TaxBracket {
  // Find the tax bracket where income is between minIncome and maxIncome.
  const result = TAX_BRACKETS[province].find(
    (bracket: TaxBracket, index: number, array: TaxBracket[]) => {
      const nextBracket = array.at(index + 1);
      return (
        annualIncome >= bracket.minIncome &&
        (!nextBracket || annualIncome < nextBracket.minIncome)
      );
    }
  );

  if (!result) {
    throw new Error("No bracket found");
  }
  return result;
}

// Takes: An annual income and a tax bracket.
// Returns: The tax amount for the income and bracket.
// Determine insurable amount based on age and annual income.
export function calculateInsuredIncomeAmount(
  annualIncome: number,
  age: number
): number {
  // Calculate amount using a product of the annual income and a constant for the age range.
  // Includes a set max value for each range.
  if (age >= 70) {
    return 100000;
  } else if (age >= 61) {
    return Math.max(250000, 10 * annualIncome);
  } else if (age >= 51) {
    return Math.max(250000, 15 * annualIncome);
  } else if (age >= 41) {
    return Math.max(500000, 20 * annualIncome);
  } else if (age >= 31) {
    return Math.max(500000, 25 * annualIncome);
  } else if (age >= 16) {
    return Math.max(500000, 30 * annualIncome);
  } else {
    return 0;
  }
}

// Converts a date to UTC in format YYYY-MM-DD.
export function getDateInUtc(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

// Finds the year the user will reach the life expectancy.
export function calculateLifeExpectancyYear(
  age: number,
  lifeExpectancy: number
): number {
  const currentYear = new Date().getFullYear();
  return currentYear + lifeExpectancy - age;
}
