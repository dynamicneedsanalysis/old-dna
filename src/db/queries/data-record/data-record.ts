import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { clients } from "@/db/schema/index";
import {
  createAssetRecords,
  createAssetWithBeneficiariesRecords,
  createBeneficiaryRecords,
  createBusinessAndEntitiesRecords,
  createDebtRecords,
  createGoalRecords,
  createTotalInsurableNeedsRecord,
  createBudgetRecord,
  createDocumentRecords,
  createIllustrationRecords,
  createNewBusinessRecord,
  createSettlingRequirementsRecord,
  getUserSubscriptionRecord,
} from "@/db/queries/data-record/record-helpers";
import { eq, sql } from "drizzle-orm";
import { getAccessToken, getUserProperties } from "@/lib/kinde";

// Takes: User ID, email, first name, and last name.
// Returns: User data record.
// Gets a record of all User related data through passed values and User properties.
export async function createUserDataRecord(
  userId: string,
  email: string | null,
  firstName: string | null,
  lastName: string | null
) {
  // Get user data through a mightFail function.
  const { data, error } = await mightFail(async () => {
    // Get access token and use it to get the User properties.
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw "Could not access user data.";
    }
    const userProperties = await getUserProperties(userId, accessToken);

    // If the User properties are not successfully retrieved, throw an error.
    if (userProperties.status !== "success") {
      throw "Could not access user data.";
    }

    // Get the Stripe subscription data for the User.
    const subscriptionData = await getUserSubscriptionRecord(userId);

    // Compile the relevant User data to a single object and return it.
    return {
      email: email ? email : null,
      firstName: firstName ? firstName : null,
      lastName: lastName ? lastName : null,
      agencyName: userProperties.properties.agencyName,
      streetAddress: userProperties.properties.streetAddress,
      city: userProperties.properties.city,
      provinceOrState: userProperties.properties.provinceOrState,
      postcode: userProperties.properties.postcode,
      certifications: userProperties.properties.certifications,
      licensedProvinces: userProperties.properties.licensedProvinces,
      insurers: userProperties.properties.insurers,
      subscription: subscriptionData,
    };
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the User data.
  return { assets: data };
}

// Define query to get relevant Client data.
const clientDataRecordQuery = db
  .select({
    id: clients.id,
    name: clients.name,
    birthDate: clients.birthDate,
    province: clients.province,
    annualIncome: clients.annualIncome,
    liquidityAllocatedTowardsGoals: clients.liquidityAllocatedTowardsGoals,
    taxFreezeAtYear: clients.taxFreezeAtYear,
    lifeExpectancy: clients.lifeExpectancy,
    hasOnboarded: clients.hasOnboarded,
    reasonsWhy: clients.reasonsWhy,
    coverLetter: clients.coverLetter,
    sex: clients.sex,
    smokingStatus: clients.smokingStatus,
    health: clients.health,
  })
  .from(clients)
  .where(eq(clients.kindeId, sql.placeholder("userId")))
  .prepare("clientDataQuery");

// Takes: User ID.
// Returns: Client data record.
// Gets a record of all Client data and data related to the Clients.
export async function createClientDataRecord(userId: string) {
  // Get Client data through a might fail function.
  const { data, error } = await mightFail(async () => {
    // Define array for client data and retrieve the base Client data.
    const allClientData = [];
    const clientBaseData = await clientDataRecordQuery.execute({ userId });

    // Iterate over the clients to get the other data elements related to each Client.
    for (const client of clientBaseData) {
      // Get all data elements related to the Client through helpers.
      const clientAssets = await createAssetRecords(client.id);
      const clientBeneficiaries = await createBeneficiaryRecords(client.id);
      const clientAssetsWithBeneficiaries =
        await createAssetWithBeneficiariesRecords(client.id);
      const clientBusinesses = await createBusinessAndEntitiesRecords(
        client.id
      );
      const clientDebts = await createDebtRecords(client.id);
      const clientTotalInsurableNeeds = await createTotalInsurableNeedsRecord(
        client.id
      );
      const clientBudget = await createBudgetRecord(client.id);
      const clientGoals = await createGoalRecords(client.id);
      const clientDocuments = await createDocumentRecords(client.id);
      const clientIllustrations = await createIllustrationRecords(client.id);
      const clientNewBusiness = await createNewBusinessRecord(client.id);
      const clientSettlingRequirements = await createSettlingRequirementsRecord(
        client.id
      );

      // Create formatted Client data object for the current Client.
      // Either adds data record or empty object indicating no data was present.
      const clientData = {
        clientInfo: {
          name: client.name,
          birthDate: client.birthDate,
          province: client.province,
          annualIncome: client.annualIncome,
          liquidityAllocatedTowardsGoals: client.liquidityAllocatedTowardsGoals,
          taxFreezeAtYear: client.taxFreezeAtYear,
          lifeExpectancy: client.lifeExpectancy,
          hasOnboarded: client.hasOnboarded,
          sex: client.sex,
          smokingStatus: client.smokingStatus,
          health: client.health,
          budgetIncome: clientBudget.budget![0].income,
          totalInsurableNeeds: clientTotalInsurableNeeds.totalInsurableNeeds,
        },
        clientLetters: {
          reasonsWhy: client.reasonsWhy,
          coverLetter: client.coverLetter,
        },
        clientFiles: {
          clientDocuments: clientDocuments.documents,
          clientIllustrations: clientIllustrations.illustrations,
        },
        clientAssets: clientAssets.clientAssets,
        clientBeneficiaries: clientBeneficiaries.clientBeneficiaries,
        clientAssetsWithBeneficiaries:
          clientAssetsWithBeneficiaries.clientAssetsWithBeneficiaries,
        clientBusinesses: clientBusinesses.businesses,
        clientDebts: clientDebts.debts,
        clientGoals: clientGoals.goals,
        clientNewBusiness: clientNewBusiness.newBusiness,
        clientSettlingRequirements:
          clientSettlingRequirements.settlingRequirements,
      };

      // Add the data object for the current Client to the array of all Client data.
      allClientData.push(clientData);
    }
    // Return the array of all Client data.
    return allClientData;
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the Client.
  return { clientData: data };
}
