import { getAccessToken, getUser, getUserProperties } from "@/lib/kinde";
import { calculateTotalNetWorthForCurrentYear } from "@/lib/asset/utils";
import { calculateBudgetRecommendation } from "@/lib/budget/utils";
import {
  selectAllAssetsWithBeneficiaries,
  selectAllBeneficiaries,
  selectSingleClient,
  selectAllDebts,
  selectAllGoals,
} from "@/db/queries/index";
import { selectSingleBudget } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/queries/budget";
import { selectAllBusinessKeyPeopleAndShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/queries/businesses";

// Takes: A Client Id and a Kinde Id.
// Returns: A JSON string with the Client's information.
export async function getClientInformation(
  clientId: number,
  kindeId: string
): Promise<string> {
  // Fetch the Client's information from the database.
  const [
    { client, error: clientError },
    { beneficiaries, error: beneficiariesError },
    { businesses, error: businessesError },
    { assets, error: assetsError },
    { debts, error: debtsError },
    { goals, error: goalsError },
    { budget, error: budgetError },
  ] = await Promise.all([
    selectSingleClient({ id: clientId, kindeId }),
    selectAllBeneficiaries(clientId),
    selectAllBusinessKeyPeopleAndShareholders(clientId),
    selectAllAssetsWithBeneficiaries(clientId),
    selectAllDebts(clientId),
    selectAllGoals(clientId),
    selectSingleBudget(clientId),
  ]);

  // Checks all errors and sets true if if any are present.
  const haveError =
    clientError ||
    beneficiariesError ||
    businessesError ||
    assetsError ||
    debtsError ||
    goalsError ||
    budgetError;

  // Checks all expected values and sets true if any are missing.
  const missingData =
    !client ||
    !beneficiaries ||
    !businesses ||
    !assets ||
    !debts ||
    !goals ||
    !budget;

  // If either haveError or missingData are true, throw an error.
  if (haveError || missingData) {
    throw new Error("Failed to fetch user profile");
  }

  // Get net worth, Budget recommendation, and User properties.
  const netWorth = calculateTotalNetWorthForCurrentYear(assets);
  const budgetRecommendation = calculateBudgetRecommendation(
    parseFloat(client.annualIncome),
    netWorth
  );

  // Get the User and their Access Token and use it to get their Properties.
  const user = await getUser();
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Failed to fetch user profile");
  }
  const userProperties = await getUserProperties(user.id, accessToken);
  if (userProperties.status === "error") {
    throw new Error("Failed to fetch user profile");
  }

  // Return the Client information as a JSON string.
  return JSON.stringify({
    client,
    beneficiaries,
    businesses,
    assets,
    debts,
    goals,
    budget: {
      id: budget.id,
      clientId: budget.clientId,
      proposedBudget: budget.income,
      minimumBudget: budgetRecommendation.minBudget,
      maximumBudget: budgetRecommendation.maxBudget,
      minimumBudgetPercentage: 5,
      maximumBudgetPercentage: budgetRecommendation.maxBudgetPercentage,
      fromMaximumIncomeOrNetWorth: budgetRecommendation.isFromMaxIncome
        ? "income"
        : "net worth",
    },
    advisor: {
      firstName: user.given_name,
      lastName: user.family_name,
      ...userProperties.properties,
    },
  });
}
