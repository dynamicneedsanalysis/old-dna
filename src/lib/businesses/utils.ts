import { toCamelCase } from "@/lib/utils";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";
import type { KeyPerson } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";
import type { Shareholder } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/schema";
import type { BusinessKeyPeopleShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/businesses";

// Takes: A Business, a Key Person, and a life expectancy.
// Returns: The final EBITDA contribution of the Key Person.
export function calculateFinalEbitdaContribution(
  business: Business,
  keyPerson: KeyPerson,
  lifeExpectancy: number
): number {
  const term = business.term
    ? Math.min(20, parseFloat(business.term))
    : lifeExpectancy + 5;

  return (
    (parseFloat(keyPerson.ebitdaContributionPercentage) / 100) *
    parseFloat(business.ebitda) *
    Math.pow(
      1 + Math.min(parseFloat(business.appreciationRate), 6) / 100,
      Math.min(term, 5)
    )
  );
}

// Takes: A Business, a Shareholder, and a life expectancy.
// Returns: The final Share value of the Shareholder at end of life expectancy.
export function calculateFinalShareValue(
  business: Business,
  shareholder: Shareholder,
  lifeExpectancy: number
): number {
  const term = business.term
    ? Math.min(20, parseFloat(business.term))
    : lifeExpectancy + 5;

  return (
    (parseFloat(shareholder.sharePercentage) / 100) *
    parseFloat(business.valuation) *
    Math.pow(
      1 + Math.min(parseFloat(business.appreciationRate), 6) / 100,
      Math.min(term, 5)
    )
  );
}

// Takes: A Business and the EDIBTA contribution percentage.
// Returns: An array of the compounded EBITDA contributions over the Business term.
function calculateCompoundedEbitdaContribution(
  business: Business,
  ebitdaContributionPercentage: KeyPerson["ebitdaContributionPercentage"]
): number[] {
  const contributions: number[] = [];
  const term = business.term ? Math.min(10, parseFloat(business.term)) : 10;

  for (let year = 0; year <= term; year++) {
    const compounded: number =
      (parseFloat(ebitdaContributionPercentage) / 100) *
      parseFloat(business.ebitda) *
      Math.pow(1 + parseFloat(business.appreciationRate) / 100, year);
    contributions.push(compounded);
  }
  return contributions;
}

// Takes: An array of Business Key People Shareholders.
// For each Business, calculates the EBITDA contributions for the Client and Key People.
// Returns: An array of object connecting years to an array of the EBITDA contributors and contributions.
export function generateEbitdaSeries(
  businesses: BusinessKeyPeopleShareholders[]
): { [key: string]: number | string }[] {
  const currentYear = new Date().getFullYear();
  const yearMap: {
    [year: string]: { year: string; [key: string]: number | string };
  } = {};

  // Calculate all contributions
  businesses.forEach((business) => {
    const key = `${toCamelCase(business.name)}-${toCamelCase(business.client.name)}`;
    // Calculate the EBITDA contributions for the Business and record them for each year.
    const contributionValues = calculateCompoundedEbitdaContribution(
      business,
      business.clientEbitdaContributed
    );
    contributionValues.forEach((value, index) => {
      const year = (currentYear + index).toString();
      if (!yearMap[year]) {
        yearMap[year] = { year };
      }
      yearMap[year][key] = value;
    });

    business.keyPeople.forEach((kp) => {
      const key = `${toCamelCase(business.name)}-${toCamelCase(kp.name)}`;
      // Calculate the EBITDA contributions for the Key People and record them for each year.
      const kpContributionValues = calculateCompoundedEbitdaContribution(
        business,
        kp.ebitdaContributionPercentage
      );
      kpContributionValues.forEach((value, index) => {
        const year = (currentYear + index).toString();
        if (!yearMap[year]) {
          yearMap[year] = { year };
        }
        yearMap[year][key] = value;
      });
    });
  });

  // Return the sorted contributions by year.
  return Object.values(yearMap).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
}

// Takes: The Business and a Shareholder.
// Returns: An array of the compounded values for the Shareholder over the term of the Business.
function calculateShareValueOverTime(
  business: Business,
  shareholder: Shareholder
): number[] {
  const values: number[] = [];

  // Determine the term of the Business with a minimum of 10 years.
  const term = business.term ? Math.min(10, parseFloat(business.term)) : 10;

  // Calculate the Shareholder's compounded values over the term of the Business.
  for (let year: number = 0; year <= term; year++) {
    const value: number =
      (parseFloat(shareholder.sharePercentage) / 100) *
      parseFloat(business.valuation) *
      Math.pow(1 + parseFloat(business.appreciationRate) / 100, year);
    values.push(value);
  }
  return values;
}

// Takes: An array of the Shareholders from the Key People of a Business.
// Calculates the share value for each Shareholder (including the Client) over the term of the Business.
// Returns: An array of object connecting years to an array of the Shareholders and their yearly share values.
export function generateShareValueSeries(
  businesses: BusinessKeyPeopleShareholders[]
): { year: string; [key: string]: number | string }[] {
  const startYear = new Date().getFullYear();
  const yearsMap: {
    [year: string]: { year: string; [key: string]: number | string };
  } = {};

  businesses.forEach((business) => {
    const key = `${toCamelCase(business.name)}-${toCamelCase(business.client.name)}`;
    // Calculate the share values for the Client and Business.
    const shareValues = calculateShareValueOverTime(business, {
      id: business.client.id,
      name: business.client.name,
      sharePercentage: business.clientSharePercentage,
      insuranceCoverage: business.clientShareholderInsuranceContribution,
      businessId: business.id,
      createdAt: business.client.createdAt,
    });
    // Record the Client share values for each year.
    shareValues.forEach((value, index) => {
      const year = (startYear + index).toString();
      if (!yearsMap[year]) {
        yearsMap[year] = { year };
      }
      yearsMap[year][key] = value;
    });
    business.shareholders.forEach((shareholder) => {
      const key = `${toCamelCase(business.name)}-${toCamelCase(shareholder.name)}`;
      // Calculate the share values for the regular Shareholders.
      const shareValues = calculateShareValueOverTime(business, shareholder);

      // Record the Shareholder share values for each year.
      shareValues.forEach((value, index) => {
        const year = (startYear + index).toString();
        if (!yearsMap[year]) {
          yearsMap[year] = { year };
        }
        yearsMap[year][key] = value;
      });
    });
  });
  return Object.values(yearsMap).sort(
    (a, b) => parseInt(a.year) - parseInt(b.year)
  );
}
