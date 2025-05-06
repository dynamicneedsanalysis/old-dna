import { mightFail } from "@/lib/utils";
import { getAccessToken, getUserProperties } from "@/lib/kinde";
import { db } from "@/db";
import { clients } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import {
  createStripeDataSummary,
  createClientSummary,
  createAssetSummary,
  createBeneficiarySummary,
  createBusinessSummary,
  createBudgetSummary,
  createDebtSummary,
  createDocumentSummary,
  createIllustrationSummary,
  createGoalSummary,
  createNewBusinessSummary,
  createSettlingRequirementsSummary,
  createTotalInsurableNeedsSummary,
} from "@/db/queries/data-summary/summary-helpers";
import { subscriptions } from "@/db/schema/subscriptions";

// Takes: A User Id.
// Returns: A User data summary.
// Uses passed values and User properties to create a User data summary.
export async function createUserDataSummary(userId: string) {
  // Run summary creation through a mightFail function to catch any errors.
  const { data, error } = await mightFail(async () => {
    // Get the access token for the User and use it to get the User's properties.
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw "Could not access user data.";
    }
    const userResult = await getUserProperties(userId, accessToken);

    // If the User properties are not successfully retrieved, throw an error.
    if (userResult.status !== "success") {
      throw "Could not access user data.";
    }
    const userProperties = userResult.properties;

    // Create the User summary string.
    let userSummary = `User Data Summary: \n\n`;

    // Add lines to summary for data elements present for all Users.
    userSummary += ` - Email: The user email address. Recorded to create and identify accounts uniquely.\n Entered through text input on account creation. Data is stored until it is updated and overwritten or the account is deleted.\n\n`;

    userSummary += ` - Name: The user first and last name. Recorded to define agent profile information.\n Entered through text input on account creation. Data is stored until it is updated and overwritten or the account is deleted.\n\n`;

    // Add summary lines for location values from the User properties.
    if (
      userProperties.streetAddress ||
      userProperties.city ||
      userProperties.provinceOrState ||
      userProperties.postcode
    ) {
      const addressElements = [];
      if (userProperties.streetAddress) {
        addressElements.push(`Street Address`);
      }
      if (userProperties.city) {
        addressElements.push(`City`);
      }
      if (userProperties.provinceOrState) {
        addressElements.push(`Province or State`);
      }
      if (userProperties.postcode) {
        addressElements.push(`Postcode`);
      }
      userSummary += ` - Location: A set of ${addressElements.length} elements identifying your location. Recorded to define agent profile information.\n Entered through text inputs on profile section of the settings page.\n Data is stored until it is updated and overwritten or the account is deleted\n Consists of the following elements: ${addressElements.join(", ")}.\n\n`;
    }

    // Add summary lines for the agency, certifications, licenses, and represented insurers.
    if (userProperties.agencyName) {
      userSummary += ` - Agency Name: The agency name of the user. Recorded to define agent profile information.\n Entered through text input in the profile section of the setting page. Data is stored until it is updated and overwritten or the account is deleted\n\n`;
    }
    if (userProperties.certifications) {
      userSummary += ` - Certifications: A list of the users certifications. Recorded to define agent profile information.\n Entered through comma separated text input in the profile section of the setting page. Data is stored until it is updated and overwritten or the account is deleted\n\n`;
    }
    if (userProperties.licensedProvinces.length) {
      userSummary += ` - Licensed Provinces: A list of provinces and territories the user is licensed in. Recorded to define agent profile information.\n Entered through checkbox selection in the settings page, under the profile tab. Data is stored until it is updated and overwritten or the account is deleted\n\n`;
    }
    if (userProperties.insurers.length) {
      userSummary += ` - Insurers: A list of insurance companies represented by the user. Recorded to define agent profile information.\n Entered through checkbox selection in the profile section of the setting page. Data is stored until it is updated and overwritten or the account is deleted\n\n`;
    }

    // Check for a user subscription and add a summary line if present.
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.referenceId, userId));

    if (userSubscription.length !== 0) {
      const presentStripeData = await createStripeDataSummary(
        userSubscription[0].stripeCustomerId
      );

      userSummary += ` - Stripe Customer: A collection of user and payment information used by Stripe. Recorded to handle payment, track your subscription, and assist with further payments.\n ${presentStripeData}.\n Created as part of the initial subscription purchase. Data is stored until it is updated and overwritten through subscription management or the account is deleted.\n\n`;
    }

    // Return the summary string with aggregated User data.
    return userSummary + `\n\n`;
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the User data summary.
  return { userSummary: data };
}

// Takes: A User Id.
// Returns: A Client data summary.
// Checks for Client data and creates a summary of Client data.
// If a Client is associated with a database object, adds that object to the summary.
export async function createClientDataSummary(userId: string) {
  // Run summary creation through a mightFail function to catch any errors.
  const { data, error } = await mightFail(async () => {
    // Create a Client data summary string.
    let clientDataSummary = ``;

    // Get the Client data for the User.
    const clientData = await db
      .select()
      .from(clients)
      .where(eq(clients.kindeId, userId));

    // Check if Client data is present and create a summary for each data type.
    if (clientData.length !== 0) {
      // Add summary info for the Client objects.
      clientDataSummary += (await createClientSummary()).client;

      // Get the Id's of all Clients to check for related database objects.
      const clientIds = clientData.map((client) => client.id);

      // Check if the Clients are related to the different database objects.
      // If a related object is found, adds its info to the summary.
      // If no related object is found, adds a message indicating that.
      clientDataSummary += (await createAssetSummary(clientIds)).assets;
      clientDataSummary += (await createBeneficiarySummary(clientIds))
        .beneficiaries;
      clientDataSummary += (await createBusinessSummary(clientIds)).businesses;
      clientDataSummary += (await createDebtSummary(clientIds)).debts;
      clientDataSummary += (await createGoalSummary(clientIds)).goals;
      clientDataSummary += (await createDocumentSummary(clientIds)).documents;
      clientDataSummary += (await createIllustrationSummary(clientIds))
        .illustrations;
      clientDataSummary += (await createTotalInsurableNeedsSummary(clientIds))
        .totalInsurableNeeds;
      clientDataSummary += (await createBudgetSummary(clientIds)).budget;
      clientDataSummary += (await createNewBusinessSummary(clientIds))
        .newBusiness;
      clientDataSummary += (await createSettlingRequirementsSummary(clientIds))
        .settlingRequirements;
    } else {
      // If no client data is present, return a summary indicating that.
      clientDataSummary = ` - Clients: N/A\n\n`;
    }

    // Return the client data summary string.
    return clientDataSummary;
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the Client data summary.
  return { clientSummary: data };
}
