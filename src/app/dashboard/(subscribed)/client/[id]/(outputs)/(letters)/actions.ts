"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAccessToken, getUser, getUserProperties } from "@/lib/kinde";
import { mightFail } from "@/lib/utils";
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
import type { LetterType } from "@/constants/index";

// Takes: A Client ID, a Letter Type string, and an optional Modifier Prompt.
export async function updateLetter({
  content,
  type,
  clientId,
}: {
  clientId: number;
  content: string;
  type: LetterType;
}) {
  // Update the Letter in the Database with the passed values.
  const { error } = await mightFail(() =>
    db
      .update(clients)
      .set(
        type === "cover-letter"
          ? { coverLetter: content }
          : { reasonsWhy: content }
      )
      .where(eq(clients.id, clientId))
  );

  // Return the nullable error from the mightFail function.
  return error;
}

// Takes: A Client ID, a Letter Type string, and an optional Modifier Prompt.
// Returns: The generated Letter content.
export async function generateLetter({
  clientId,
  type,
  modifierPrompt,
}: {
  clientId: number;
  type: LetterType;
  modifierPrompt?: string;
}) {
  // Get the current User and create a Streamable Value.
  const user = await getUser();
  const stream = createStreamableValue("");
  let result = "";

  (async () => {
    // Get the text Stream from a call to an AI Model to generate the Letter.
    // Generates based on static instructions, client data, and a prompt for the letter type.
    // Also allows for an optional modifier prompt.
    const { textStream } = streamText({
      model: openai("gpt-4-turbo"),
      prompt: `${getPrompt({ type })} 
    - Output the letter in plain text! DON'T use Markdown.
    - Only output the letter itself as a response. 
    - Ensure the revised letter maintains a formal tone and professional language. 
    - Regenerate a different response each time. 
    - Incorporate relevant information for client and advisor details.
  ${await getClientInformation(clientId, user.id)}
    - If this client shares the name of a famous person, but we are talking about someone else. 
    - If a modifier prompt is provided, revise the letter to align with the specific guidance. 
    ${"Modifier prompt: " + modifierPrompt}`,
    });

    // Await the text stream to generate the letter result.
    for await (const delta of textStream) {
      // Record the changes to the Streamable Value as the Letter is generated.
      stream.update(delta);
      result += delta;
    }

    // Mark the Stream as done and update the Letter in the Database.
    stream.done();
    await updateLetter({ content: result, clientId, type });
  })();

  return {
    letter: stream.value,
  };
}

// Takes: A Letter Type string. {"cover-letter" | "reasons-why"}.
// Returns: A prompt for the specified Letter Type.
function getPrompt({ type }: { type: "cover-letter" | "reasons-why" }): string {
  switch (type) {
    case "reasons-why":
      return `Compose a formal reasons why letter from the advisor and their agency to the client. 
      - Format it like the following:
      Dear [Client First Name],

      [content]

      Yours sincerely,
      [Advisor Full Name] 
      [Advisor Agency]
      - Exclude the standard headers \`Reasons why letter\` and \`End of the letter\`.`;
    case "cover-letter":
      return `Compose a formal cover letter from the advisor and their agency to the insurance company. 
      - Format it like the following:
      To: [Insurance Company Name]

      From: [Advisor Full Name], [Advisor Agency], [Advisor Address]

      Subject: [Subject]

      Dear Underwriting Team,

      [content]

      Yours sincerely,
      [Advisor Full Name] 
      [Advisor Agency]`;
    default:
      return `Say "invalid letter type."`;
  }
}

// Takes: A Client ID and a Kinde ID.
// Returns: A promise of the Client Information as a JSON string.
async function getClientInformation(
  clientId: number,
  kindeId: string
): Promise<string> {
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

  // Define the Client fields to fetch using database queries.
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

  // Use the Client Assets, Annual Income, and Net Worth to calculate the Budget recommendation.
  const netWorth = calculateTotalNetWorthForCurrentYear(assets);
  const budgetRecommendation = calculateBudgetRecommendation(
    parseFloat(client.annualIncome),
    netWorth
  );

  // Stringify the Client Information with the fetched data and Budget recommendation.
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
