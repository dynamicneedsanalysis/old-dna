import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import {
  assets,
  assetBeneficiaries,
  beneficiaries,
  businesses,
  debts,
  documents,
  goals,
  illustrations,
  keyPeople,
  newBusiness,
  shareholders,
  settlingRequirements,
  totalInsurableNeeds,
  budgets,
} from "@/db/schema/index";
import { eq, sql } from "drizzle-orm";
import { subscriptions } from "@/db/schema/subscriptions";
import { stripe } from "@/lib/stripe/utils";

export async function getUserSubscriptionRecord(userId: string) {
  const { data, error } = await mightFail(async () => {
    // Get the user's subscription data from the database.
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.referenceId, userId));

    // If the user has a subscription, get their data from Stripe.
    if (userSubscription.length !== 0) {
      // Get customer and billing data from Stripe.
      const userCustomer = await stripe.customers.retrieve(
        userSubscription[0].stripeCustomerId
      );
      const userBilling = await stripe.customers.listPaymentMethods(
        userSubscription[0].stripeCustomerId
      );

      // Check the Stripe customer is found and is not deleted.
      if (!userCustomer || userCustomer.deleted) {
        return null;
      }

      // Make an array for the relevant billing details.
      const billingDetails = [];

      // Iterate over the billing details and add them to the array.
      for (const billingDetail of userBilling.data) {
        billingDetails.push({
          name: billingDetail.billing_details.name,
          email: billingDetail.billing_details.email,
          phone: billingDetail.billing_details.phone,
          location: billingDetail.billing_details.address,
          card: billingDetail.card
            ? {
                brand: billingDetail.card.brand,
                issuer: billingDetail.card.issuer,
                last4: billingDetail.card.last4,
                expiry:
                  billingDetail.card.exp_month +
                  " / " +
                  (billingDetail.card.exp_year % 1000),
                country: billingDetail.card.country,
              }
            : null,
        });
      }

      // Return the subscription data record.
      return {
        email: userCustomer.email,
        name: userCustomer.name,
        billingDetails: billingDetails,
      };
    } else {
      return null;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { userSubscription: data };
}

// Define query to get relevant Asset data for a Client.
const getAssetRecordsQuery = db
  .select({
    name: assets.name,
    initialValue: assets.initialValue,
    currentValue: assets.currentValue,
    yearAcquired: assets.yearAcquired,
    rate: assets.rate,
    term: assets.term,
    type: assets.type,
    isTaxable: assets.isTaxable,
    isLiquid: assets.isLiquid,
    toBeSold: assets.toBeSold,
  })
  .from(assets)
  .where(eq(assets.clientId, sql.placeholder("clientId")))
  .prepare("clientAssetDataQuery");

// Takes: Client ID.
// Returns: Asset data for the Client.
// Runs query to retrieve relevant Asset data for the Client.
export async function createAssetRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getAssetRecordsQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { clientAssets: data };
}

// Define query to get relevant Beneficiary data for a Client.
const getBeneficiaryRecordsQuery = db
  .select({
    name: beneficiaries.name,
    allocation: beneficiaries.allocation,
  })
  .from(beneficiaries)
  .where(eq(beneficiaries.clientId, sql.placeholder("clientId")))
  .prepare("getClientBeneficiariesQuery");

// Takes: Client ID.
// Returns: Beneficiary data for the Client.
// Runs query to retrieve relevant Beneficiary data for the Client.
export async function createBeneficiaryRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getBeneficiaryRecordsQuery.execute({
      clientId,
    });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { clientBeneficiaries: data };
}

// Define an object for Beneficiaries for table joining on data retrieval.
export type Beneficiary = Omit<
  typeof beneficiaries.$inferSelect,
  "id" | "clientId" | "createdAt"
>;

// Define query to get relevant Asset data with their Beneficiaries for a Client.
// Connect Assets and Beneficiaries through a join table (assetBeneficiaries).
const getAssetWithBeneficiariesRecordsQuery = db
  .select({
    name: assets.name,
    initialValue: assets.initialValue,
    currentValue: assets.currentValue,
    yearAcquired: assets.yearAcquired,
    rate: assets.rate,
    term: assets.term,
    type: assets.type,
    isTaxable: assets.isTaxable,
    isLiquid: assets.isLiquid,
    toBeSold: assets.toBeSold,
    beneficiaries: sql<Beneficiary[]>`JSON_AGG(
      JSON_BUILD_OBJECT(
        'name', ${beneficiaries.name},
        'allocation', ${beneficiaries.allocation}
      )
    )`,
  })
  .from(assets)
  .leftJoin(assetBeneficiaries, eq(assets.id, assetBeneficiaries.assetId))
  .leftJoin(
    beneficiaries,
    eq(assetBeneficiaries.beneficiaryId, beneficiaries.id)
  )
  .where(eq(assets.clientId, sql.placeholder("clientId")))
  .groupBy(assets.id)
  .prepare("getClientAssetsWithBeneficiariesQuery");

// Takes: Client ID.
// Returns: Asset data with Beneficiaries for the Client.
// Runs query to retrieve relevant Asset data with their Beneficiaries for the Client.
export async function createAssetWithBeneficiariesRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getAssetWithBeneficiariesRecordsQuery.execute({
      clientId,
    });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { clientAssetsWithBeneficiaries: data };
}

// Define query to get relevant Business data for a Client.
const getBusinessRecordsQuery = db
  .select({
    id: businesses.id,
    name: businesses.name,
    purchasePrice: businesses.purchasePrice,
    yearAcquired: businesses.yearAcquired,
    appreciationRate: businesses.appreciationRate,
    valuation: businesses.valuation,
    term: businesses.term,
    toBeSold: businesses.toBeSold,
    clientSharePercentage: businesses.clientSharePercentage,
    clientShareholderInsuranceContribution:
      businesses.clientShareholderInsuranceContribution,
    ebitda: businesses.ebitda,
    clientEbitdaContributed: businesses.clientEbitdaContributed,
    clientEbitdaInsuranceContribution:
      businesses.clientEbitdaInsuranceContribution,
  })
  .from(businesses)
  .where(eq(businesses.clientId, sql.placeholder("clientId")))
  .prepare("getBusinessesQuery");

// Define queries to get relevant Key People and Shareholder data for a Client Business.
// Used as part of getting Business data for a Client.
const getBusinessKeyPeopleRecordsQuery = db
  .select({
    name: keyPeople.name,
    ebitdaContributionPercentage: keyPeople.ebitdaContributionPercentage,
    insuranceCoverage: keyPeople.insuranceCoverage,
    priority: keyPeople.priority,
  })
  .from(keyPeople)
  .where(eq(keyPeople.businessId, sql.placeholder("businessId")))
  .prepare("getBusinessesKeyPeopleQuery");

const getBusinessShareholderRecordsQuery = db
  .select({
    name: shareholders.name,
    sharePercentage: shareholders.sharePercentage,
    insuranceCoverage: shareholders.insuranceCoverage,
    priority: shareholders.priority,
  })
  .from(shareholders)
  .where(eq(shareholders.businessId, sql.placeholder("businessId")))
  .prepare("getBusinessesShareholdersQuery");

// Takes: Client ID.
// Returns: Business data for the Client.
// Runs query to retrieve relevant Business data for the Client.
export async function createBusinessAndEntitiesRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    // Get the base Businesses data for the Client and define an array for the data.
    const businesses = await getBusinessRecordsQuery.execute({ clientId });
    const businessesData = [];

    // Iterate over the Businesses to get the Key People and Shareholders data for each Business.
    for (const business of businesses) {
      const keyPeople = await getBusinessKeyPeopleRecordsQuery.execute({
        businessId: business.id,
      });
      const shareholders = await getBusinessShareholderRecordsQuery.execute({
        businessId: business.id,
      });

      // Push the formatted Business data to the array of all Business data.
      // Includes the Business, Key People, and Shareholders data.
      businessesData.push({
        business,
        businesKeyPeople: keyPeople,
        businesShareholders: shareholders,
      });
    }
    // Return the array of all Business data.
    return businessesData;
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { businesses: data };
}

// Define query to get relevant Debt data for a Client.
const getDebtRecordsQuery = db
  .select({
    id: debts.id,
    name: debts.name,
    initialValue: debts.initialValue,
    yearAcquired: debts.yearAcquired,
    rate: debts.rate,
    term: debts.term,
    annualPayment: debts.annualPayment,
    insurableFutureValue: debts.insurableFutureValue,
  })
  .from(debts)
  .where(eq(debts.clientId, sql.placeholder("clientId")))
  .prepare("getDebtsQuery");

// Takes: Client ID.
// Returns: Debt data for the Client.
// Runs query to retrieve relevant Debt data for the Client.
export async function createDebtRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return getDebtRecordsQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { debts: data };
}

// Define query to get relevant Goal data for a Client.
const getGoalRecordsQuery = db
  .select({
    name: goals.name,
    amount: goals.amount,
    isPhilanthropic: goals.isPhilanthropic,
  })
  .from(goals)
  .where(eq(goals.clientId, sql.placeholder("clientId")))
  .prepare("getGoalsQuery");

// Takes: Client ID.
// Returns: Goal data for the Client.
// Runs query to retrieve relevant Goal data for the Client.
export async function createGoalRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getGoalRecordsQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { goals: data };
}

// Define query to get relevant Total Insurable Needs data for a Client.
const getTotalInsurableNeedsRecordQuery = db
  .select({
    purpose: totalInsurableNeeds.purpose,
    priority: totalInsurableNeeds.priority,
  })
  .from(totalInsurableNeeds)
  .where(eq(totalInsurableNeeds.clientId, sql.placeholder("clientId")))
  .prepare("getTotalInsurableNeedsQuery");

// Takes: Client ID.
// Returns: Total Insurable Needs data for the Client.
// Runs query to retrieve relevant Total Insurable Needs data for the Client.
export async function createTotalInsurableNeedsRecord(clientId: number) {
  const { data, error } = await mightFail(async () => {
    return await getTotalInsurableNeedsRecordQuery.execute({
      clientId,
    });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { totalInsurableNeeds: data };
}

// Define query to get relevant Budget data for a Client.
const getBudgetRecordQuery = db
  .select({
    income: budgets.income,
  })
  .from(budgets)
  .where(eq(budgets.clientId, sql.placeholder("clientId")))
  .prepare("getBudgetQuery");

// Takes: Client ID.
// Returns: Budget data for the Client.
// Runs query to retrieve relevant Budget data for the Client.
export async function createBudgetRecord(clientId: number) {
  const { data, error } = await mightFail(async () => {
    return await getBudgetRecordQuery.execute({
      clientId,
    });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { budget: data };
}

// Define query to get relevant Document data for a Client.
const getDocumentRecordsQuery = db
  .select({
    name: documents.fileName,
    url: documents.fileUrl,
  })
  .from(documents)
  .where(eq(documents.clientId, sql.placeholder("clientId")))
  .prepare("getDocumentsQuery");

// Takes: Client ID.
// Returns: Document data for the Client (file name and storage URL).
// Runs query to retrieve relevant Document data for the Client.
export async function createDocumentRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getDocumentRecordsQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { documents: data };
}

// Define query to get relevant Illustration data for a Client.
const getIllustrationRecordsQuery = db
  .select({
    policyName: illustrations.policyName,
    carrier: illustrations.carrier,
    name: illustrations.fileName,
    url: illustrations.fileUrl,
  })
  .from(illustrations)
  .where(eq(illustrations.clientId, sql.placeholder("clientId")))
  .prepare("getIllustrationsQuery");

// Takes: Client ID.
// Returns: Illustration data for the Client:
//          (policy name, carrier, file name, and storage URL).
// Runs query to retrieve relevant Illustration data for the Client.
export async function createIllustrationRecords(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return getIllustrationRecordsQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { illustrations: data };
}

// Define query to get relevant New Business data for a Client.
const getNewBusinessRecordQuery = db
  .select({
    applicationNumber: newBusiness.applicationNumber,
    Term: newBusiness.Term,
    UL: newBusiness.UL,
    WholeLife: newBusiness.WholeLife,
    DI: newBusiness.DI,
    CI: newBusiness.CI,
    illustrationIsAttached: newBusiness.illustrationAttached,
    premiumChequeAmount: newBusiness.premiumChequeAmount,
    prePrintedVoidCheque: newBusiness.prePrintedVoidCheque,
    preAuthorizedDebitForm: newBusiness.preAuthorizedDebitForm,
    replacementForm: newBusiness.replacementForm,
    productPage: newBusiness.productPage,
    financials: newBusiness.financials,
    completedQuestionnaires: newBusiness.completedQuestionnaires,
    linkedFile: newBusiness.linkedFile,
    clientSignedAdvisorDisclosure: newBusiness.clientSignedAdvisorDisclosure,
    clientSignedFNA: newBusiness.clientSignedFNA,
    otherRequirements: newBusiness.otherRequirements,
    isUnderCloseSupervision: newBusiness.isUnderCloseSupervision,
    isDIApplication: newBusiness.isDIApplication,
    hasExistingCoverage: newBusiness.hasExistingCoverage,
  })
  .from(newBusiness)
  .where(eq(newBusiness.clientId, sql.placeholder("clientId")))
  .prepare("getNewBusinessQuery");

// Takes: Client ID.
// Returns: New Business data for the Client.
// Runs query to retrieve relevant New Business data for the Client.
export async function createNewBusinessRecord(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getNewBusinessRecordQuery.execute({ clientId });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { newBusiness: data };
}

// Define query to get relevant Settling Requirements data for a Client.
const getSettlingRequirementsRecordQuery = db
  .select({
    policyNumber: settlingRequirements.policyNumber,
    needsAnalysis: settlingRequirements.needsAnalysis,
    policyDeliveryReceipt: settlingRequirements.policyDeliveryReceipt,
    voidCheque: settlingRequirements.voidCheque,
    illustration: settlingRequirements.illustration,
    amendment: settlingRequirements.amendment,
    identificationNumber: settlingRequirements.identificationNumber,
    productPage: settlingRequirements.productPage,
    returnOfOriginalPolicy: settlingRequirements.returnOfOriginalPolicy,
    returnOfAlternatePolicy: settlingRequirements.returnOfAlternatePolicy,
    declarationOfInsurability: settlingRequirements.declarationOfInsurability,
    chequeAmount: settlingRequirements.chequeAmount,
    pacAuthorization: settlingRequirements.pacAuthorization,
    signedIllustration: settlingRequirements.signedIllustration,
    replacementForm: settlingRequirements.replacementForm,
    surrenderRequest: settlingRequirements.surrenderRequest,
    inForceNoRequirements: settlingRequirements.inForceNoRequirements,
    notTaken: settlingRequirements.notTaken,
    endorsement: settlingRequirements.endorsement,
    returnForReissue: settlingRequirements.returnForReissue,
    questionnaire: settlingRequirements.questionnaire,
    otherRequirements: settlingRequirements.otherRequirements,
  })
  .from(settlingRequirements)
  .where(eq(settlingRequirements.clientId, sql.placeholder("clientId")))
  .prepare("getSettlingRequirementsQuery");

// Takes: Client ID.
// Returns: Settling Requirements data for the Client.
// Runs query to retrieve relevant Settling Requirements data for the Client.
export async function createSettlingRequirementsRecord(clientId: number) {
  // Run data retrieval through a might fail function, returning the data.
  const { data, error } = await mightFail(async () => {
    return await getSettlingRequirementsRecordQuery.execute({
      clientId,
    });
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  return { settlingRequirements: data };
}
