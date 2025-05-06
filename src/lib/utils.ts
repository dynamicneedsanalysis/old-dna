import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats a float to format: "$1,234.56"
// Rounds up to the nearest cent, and strips cent's value if it is 0.
export const moneyFormatter = Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 2,
  roundingMode: "halfCeil",
  trailingZeroDisplay: "stripIfInteger",
});

export async function mightFail<T>(fn: () => Promise<T>) {
  let data = null;
  let error = null;
  try {
    data = await fn();
  } catch (e) {
    if (e instanceof Error) {
      error = e;
    }
  } finally {
    return { data, error };
  }
}

// Adds prefix to path depending on project environment.
export function absoluteUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}${path}` as const;
  }
  return `http://localhost:3000${path}` as const;
}

export function toCamelCase(str: string): string {
  // Escape single quotes if needed
  const escapedStr = str.replace(/'/g, "\\'");

  return escapedStr
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function roundNumericToNearestWholeNumber(value: string): string {
  // Check if the input is a valid number
  if (!/^-?\d*\.?\d+$/.test(value)) {
    throw new Error("Invalid input: must be a numeric string");
  }

  // Convert the string to a number
  const num = parseFloat(value);

  // Round to the nearest whole number
  const rounded = Math.round(num);

  // Convert back to string and return
  return rounded.toString();
}

// Takes: An Asset or Business object.
// Returns: An object with the initial value, current value, and rate.
function getEntityValues(entity: Asset | Business): {
  initialValue: string;
  currentValue: string;
  rate: string;
} {
  const isAsset =
    "initialValue" in entity && "currentValue" in entity && "rate" in entity;

  if (isAsset) {
    return {
      initialValue: entity.initialValue,
      currentValue: entity.currentValue,
      rate: entity.rate,
    };
  }
  return {
    initialValue: entity.purchasePrice,
    currentValue: entity.valuation,
    rate: entity.appreciationRate,
  };
}

// Takes: An Asset or Business object, a year, and a life expectancy.
// Calculates the value appropriately based on the year acquired, current year, and given year.
// Returns: The value of the entity at the given year.
export function calculateValueAtYear(
  entity: Asset | Business,
  yearGiven: number,
  lifeExpectancy: number
): number {
  // Determine current year and the term length of the entity to find appreciation time span.
  const currentYear: number = new Date().getFullYear();

  const entityTerm = entity.term
    ? Math.min(20, parseFloat(entity.term))
    : lifeExpectancy + 5;

  const { initialValue, currentValue, rate } = getEntityValues(entity);

  // If given year is before year bought or after the term completes, it has no value.
  if (yearGiven < entity.yearAcquired || yearGiven > currentYear + entityTerm) {
    return 0;
  }

  // If given year is the year bought, return the initial value.
  if (yearGiven === entity.yearAcquired) {
    return parseFloat(initialValue);
  }

  // If given year is the current year, return the current value.
  if (yearGiven === currentYear) {
    return parseFloat(currentValue);
  }

  // If the calculation is for a time span in the past.
  // Calculate value based on difference between initial and current value.
  if (entity.yearAcquired <= yearGiven && yearGiven <= currentYear) {
    return (
      parseFloat(initialValue) *
      Math.pow(
        parseFloat(currentValue) / parseFloat(initialValue),
        (yearGiven - entity.yearAcquired) / (currentYear - entity.yearAcquired)
      )
    );
  }

  // If the calculation is for a time span into the future.
  // Calculate value based on the current value and the appreciation rate.
  return (
    parseFloat(currentValue) *
    Math.pow(1 + parseFloat(rate) / 100, yearGiven - currentYear)
  );
}

// Formats a number to: "98.765%", trims any trailing zeroes.
export function formatPercentage(value: number): string {
  // Round to 3 decimal places
  const rounded = Math.round(value * 1000) / 1000;

  // Convert to string and trim trailing zeros after the decimal point
  return rounded.toFixed(3).replace(/\.?0+$/, "") + "%";
}

export function splitStringByComma(str: string): string[] {
  return str ? str.trim().split(/,\s*/) : [];
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Takes: The number of bytes to format.
// Returns: A string representation of the file size.
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
