import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import {
  assets,
  beneficiaries,
  businesses,
  budgets,
  debts,
  documents,
  goals,
  illustrations,
  keyPeople,
  newBusiness,
  shareholders,
  settlingRequirements,
  totalInsurableNeeds,
} from "@/db/schema/index";
import { inArray } from "drizzle-orm";
import { stripe } from "@/lib/stripe/utils";

// Takes: A Stripe customer ID.
// Returns: A Stripe data summary.
// Gets Stripe data for a user to determine collected data elements.
export async function createStripeDataSummary(stripeId: string) {
  // Get Stripe customer and payment method (billing and card) data.
  const userCustomer = await stripe.customers.retrieve(stripeId);
  const userBilling = await stripe.customers.listPaymentMethods(stripeId);

  // Create an object to store the data flags and names for the summary.
  const importantStripeData = {
    customerName: [false, "Customer Name"],
    customerEmail: [false, "Customer Email"],
    billingName: [false, "Billing Name"],
    billingEmail: [false, "Billing Email"],
    billingNumber: [false, "Billing Number"],
    billingLocation: [false, "Billing Location"],
    cardBrand: [false, "Card Brand"],
    cardIssuer: [false, "Card Issuer"],
    cardLast4: [false, "Card Last 4"],
    cardExpiry: [false, "Card Expiry"],
    cardCountry: [false, "Card Country"],
  };

  // Check the Stripe customer is found and is not deleted.
  if (!userCustomer || userCustomer.deleted) {
    return null;
  }

  // If the basic customer data is present, set the stripeData flags.
  importantStripeData.customerName[0] = userCustomer.name ? true : false;
  importantStripeData.customerEmail[0] = userCustomer.email ? true : false;

  // If card billing detail data is present, iterate over the data and set the stripeData flags.
  for (const billingDetail of userBilling.data) {
    // Set the stripeData flags for the basic billing detail data.
    if (billingDetail.billing_details.name) {
      importantStripeData.billingName[0] = true;
    }
    if (billingDetail.billing_details.email) {
      importantStripeData.billingEmail[0] = true;
    }
    if (billingDetail.billing_details.phone) {
      importantStripeData.billingNumber[0] = true;
    }
    if (billingDetail.billing_details.address) {
      importantStripeData.billingLocation[0] = true;
    }

    // Check if card data is present and set the stripeData flags.
    if (billingDetail.card) {
      if (billingDetail.card.brand) {
        importantStripeData.cardBrand[0] = true;
      }
      if (billingDetail.card.issuer) {
        importantStripeData.cardIssuer[0] = true;
      }
      if (billingDetail.card.last4) {
        importantStripeData.cardLast4[0] = true;
      }
      if (billingDetail.card.exp_month && billingDetail.card.exp_year) {
        importantStripeData.cardExpiry[0] = true;
      }
      if (billingDetail.card.country) {
        importantStripeData.cardCountry[0] = true;
      }
    }
  }

  // Construct the summary string based on the stripeData flags and values.
  let baseSummary = `Collected private or confidential data consists of: `;
  for (const data of Object.values(importantStripeData)) {
    if (data[0]) {
      baseSummary += `${data[1]}, `;
    }
  }

  // Remove trailing comma and space from the summary string, and return the summary.
  return baseSummary.slice(0, -2);
}

// Create a summary line for the client data.
export async function createClientSummary() {
  const { data, error } = await mightFail(async () => {
    // Define the client summary header string.
    let clientSummary = `Client Summary: \n\n`;

    // Define private and sensitive data that may be present in the client data.
    const importantClientInfo = `Client Name, Birth Date, Residence Province, Sex, Life Expectancy, Income, Tax Freeze Year, Allocated Liquidity, Health Class, and Smoking Status`;

    // Add the client summary information to the clientSummary string and return it.
    clientSummary += ` - Client: A collection of all client information for each client. Recorded to define identifying values and important attributes for a client.\n Private or confidential data collected for a client may include: ${importantClientInfo}.\n Entered as part of client creation and onboarding process, or later client editing. Data is stored until it is updated and overwritten, the client is deleted, or the account is deleted.\n\n`;
    return clientSummary;
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client summary.
  return { client: data };
}

// Create a summary line for the client assets data.
export async function createAssetSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client assets and create a summary line if present.
    const clientAssets = await db
      .select()
      .from(assets)
      .where(inArray(assets.clientId, clientIds));

    if (clientAssets.length !== 0) {
      // Define private and sensitive data that may be present in the client assets data.
      const importantAssetsInfo = `Initial Value, Current Value, Year Acquired, Rate, Term, Type, If It Is Taxable, If It Is Liquid, If It Is To Be Sold`;

      // Define the client assets summary string and return it.
      return ` - Assets: A collection of information for an asset. Recorded to store information about the assets of a client.\n Private or confidential data recorded for an asset may include: ${importantAssetsInfo}.\n Entered as part of the client onboarding process, or updated during later client editing. Data is stored until it is updated and overwritten, the asset is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client assets are present.
      return ` - Assets: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client assets summary.
  return { assets: data };
}

// Create a summary line for the client beneficiaries data.
export async function createBeneficiarySummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client beneficiaries and create a summary line if present.
    const clientBeneficiaries = await db
      .select()
      .from(beneficiaries)
      .where(inArray(beneficiaries.clientId, clientIds));

    if (clientBeneficiaries.length !== 0) {
      // Define private and sensitive data that may be present in the client beneficiaries data.
      const importantBeneficaryInfo = `Beneficiary Name, Allocation`;

      // Define the client beneficiaries summary string and return it.
      return ` - Beneficiaries: A collection of information for a beneficiary. Recorded to store information about the beneficiaries of a client.\n Private or confidential data recorded for a beneficiary may include: ${importantBeneficaryInfo}.\n Entered as part of the client onboarding process, or updated during later client editing. Data is stored until it is updated and overwritten, the beneficiary is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client beneficiaries are present.
      return ` - Beneficiaries: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client beneficiaries summary.
  return { beneficiaries: data };
}

// Create a summary line for the client business data.
export async function createBusinessSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client businesses and create a summary line if present.
    const clientBusinesses = await db
      .select()
      .from(businesses)
      .where(inArray(businesses.clientId, clientIds));

    if (clientBusinesses.length !== 0) {
      // Define private and sensitive data that may be present in the client business data.
      const importantBusinessInfo = `Business Name, Valuation, Purchase Price, Year Acquired, EBITDA, Appreciation Rate, Term, To Be Sold, Client Share Percentage, Client Shareholder Insurance Contribution, Client EBITDA Contributed, Client EBITDA Insurance Contribution`;

      // Define the client business summary string.
      let businessSummary = ` - Business: A collection of information for a business. Recorded to store information about the businesses of a client.\n Private or confidential data recorded for a Business may include: ${importantBusinessInfo}.\n Entered as part of the client onboarding process, or updated during later client editing. Data is stored until it is updated and overwritten, the business is deleted, the owner client is deleted, or the account is deleted.\n\n`;

      // Get the Id's of all businesses to check for related database objects.
      const businessIds = clientBusinesses.map((business) => business.id);

      // Create and add summary strings for the business shareholders and key people.
      businessSummary += (await createShareholdersSummary(businessIds))
        .shareholders;
      businessSummary += (await createKeyPeopleSummary(businessIds)).keyPeople;

      // Return the client business, shareholders, and key people summary.
      return businessSummary;
    } else {
      // Return a message indicating that no client businesses are present.
      return ` - Businesses: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client business summary.
  return { businesses: data };
}

// Create a summary line for the client debts data.
async function createKeyPeopleSummary(businessIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for business key people and create a summary line if present.
    const businessKeyPeople = await db
      .select()
      .from(keyPeople)
      .where(inArray(keyPeople.businessId, businessIds));

    if (businessKeyPeople.length !== 0) {
      // Define private and sensitive data that may be present in the business key people data.
      const importantKeyPeopleInfo = `Key Person Name, EBITDA Contribution Percentage, Insurance Coverage, Priority`;

      // Define the business key people summary string and return it.
      return ` - Key People: A collection of information for a key person of a business. Recorded to store information about the key people of a business.\n Private or confidential data recorded for a key person may include: ${importantKeyPeopleInfo}.\n Entered as part of the business creation step of the client onboarding process, or updated during later editing. Data is stored until it is updated and overwritten, the key person is deleted, the owner business is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no business key people are present.
      return ` - Key People: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the business key people summary.
  return { keyPeople: data };
}

// Create a summary line for the client debts data.
async function createShareholdersSummary(businessIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for business shareholders and create a summary line if present.
    const businessShareholders = await db
      .select()
      .from(shareholders)
      .where(inArray(shareholders.businessId, businessIds));

    if (businessShareholders.length !== 0) {
      // Define private and sensitive data that may be present in the business shareholders data.
      const importantShareholderInfo = `Shareholder Name, Share Percentage, Insurance Coverage, Priority`;

      // Define the business shareholders summary string and return it.
      return ` - Shareholders: A collection of information for a shareholder of a business. Recorded to store information about a shareholders of a business.\n Private or confidential data recorded for a shareholder may include: ${importantShareholderInfo}.\n Entered as part of the business creation step of the client onboarding process, or updated during later editing. Data is stored until it is updated and overwritten, the shareholder is deleted, the owner business is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no business shareholders are present.
      return ` - Shareholders: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the business shareholders summary.
  return { shareholders: data };
}

// Create a summary line for the client debts data.
export async function createDebtSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client debts and create a summary line if present.
    const clientDebts = await db
      .select()
      .from(debts)
      .where(inArray(debts.clientId, clientIds));

    if (clientDebts.length !== 0) {
      // Define private and sensitive data that may be present in the client debts data.
      const importantDebtInfo = `Debt Name, Initial Value, Year Acquired, Rate, Term, Annual Payment, Insurable Future Value`;

      // Define the client debts summary string and return it.
      return ` - Debts: A collection of information for a debt. Recorded to store information about the debts of a client.\n Private or confidential data recorded for a debt may include: ${importantDebtInfo}.\n Entered as part of the client onboarding process, or updated during later client editing. Data is stored until it is updated and overwritten, the debt is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client debts are present.
      return ` - Debts: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client debts summary
  return { debts: data };
}

// Create a summary line for the client goals data.
export async function createGoalSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client goals and create a summary line if present.
    const clientGoals = await db
      .select()
      .from(goals)
      .where(inArray(goals.clientId, clientIds));

    if (clientGoals.length !== 0) {
      // Define private and sensitive data that may be present in the client goals data.
      const importantGoalInfo = `Goal Name, Amount, Is Philanthropic`;

      // Define the client goals summary string and return it.
      return ` - Goals: A collection of information for a goal. Recorded to store information about the goals of a client.\n Private or confidential data recorded for a goal may include: ${importantGoalInfo}.\n Entered as part of the client onboarding process, or updated during later client editing. Data is stored until it is updated and overwritten, the goal is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client goals are present.
      return ` - Goals: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client goals summary.
  return { goals: data };
}

// Create a summary line for the client documents data.
export async function createDocumentSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client documents and create a summary line
    const clientDocuments = await db
      .select()
      .from(documents)
      .where(inArray(documents.clientId, clientIds));

    if (clientDocuments.length !== 0) {
      // Define private and sensitive data that may be present in the client uploaded documents records.
      const importantDocumentInfo = `Document Name, Hosted Document URL`;

      // Define the client documents summary string and return it.
      return ` - Documents: A collection of information for the record of an uploaded document. Recorded to store information about the documents uploaded by a client.\n Private or confidential data recorded for an uploaded document may include: ${importantDocumentInfo}.\n Created when a document is uploaded. Data is stored until the document is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client documents are present.
      return ` - Documents: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client documents summary.
  return { documents: data };
}

// Create a summary line for the client illustrations data.
export async function createIllustrationSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client illustrations and create a summary line if present.
    const clientIllustrations = await db
      .select()
      .from(illustrations)
      .where(inArray(illustrations.clientId, clientIds));

    if (clientIllustrations.length !== 0) {
      // Define private and sensitive data that may be present in the client uploaded illustration records.
      const importantIllustrationInfo = `Illustration Policy Name, Carrier, Hosted Illustration URL`;

      // Define the client illustrations summary string and return it.
      return ` - Illustrations: A collection of information for the record of an uploaded illustration. Recorded to store information about the illustrations uploaded by a client.\n Private or confidential data recorded for an uploaded illustration may include: ${importantIllustrationInfo}.\n Created when the illustration is uploaded. Data is stored until the illustration is deleted, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client illustrations are present.
      return ` - Illustrations: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client illustrations summary.
  return { illustrations: data };
}

// Create a summary line for the client key people data.
export async function createBudgetSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client budgets and create a summary line if present.
    const clientBudget = await db
      .select()
      .from(budgets)
      .where(inArray(budgets.clientId, clientIds));

    if (clientBudget.length !== 0) {
      // Define private and sensitive data that may be present in the client budget data.
      const importantBudgetInfo = `Budget Income`;

      // Define the client budgets summary string and return it
      return ` - Budget: A collection of information for a budget. Recorded to store information about the budgets of a client.\n Private or confidential data recorded for a budget may include: ${importantBudgetInfo}.\n Created during the client creation process, or updated via the dashboard. Data is stored until it is updated and overwritten, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      return ` - Budget: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client budget summary
  return { budget: data };
}

// Create a summary line for the client key people data.
export async function createTotalInsurableNeedsSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client total insurable needs and create a summary line if present.
    const clientTotalInsurableNeeds = await db
      .select()
      .from(totalInsurableNeeds)
      .where(inArray(totalInsurableNeeds.clientId, clientIds));

    if (clientTotalInsurableNeeds.length !== 0) {
      // Define private and sensitive data that may be present in the client total insurable needs data.
      const importantTotalInsurableNeedsInfo = `Income Replacement Priority, Tax Burden Priority, Equalization Priority, Debt Current Liability Priority, Goal Shortfall Priority`;

      // Define the client total insurable needs summary string and return it.
      return ` - Total Insurable Needs: A collection of information defining a set of total insurable needs. Recorded to store information about the total insurable needs of a client.\n Private or confidential data recorded for the total insurable needs may include: ${importantTotalInsurableNeedsInfo}.\n Created during the client creation process, or updated via the dashboard. Data is stored until it is updated and overwritten, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client total insurable needs are present.
      return ` - Total Insurable Needs: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client total insurable needs summary.
  return { totalInsurableNeeds: data };
}

// Create a summary line for the client key people data.
export async function createNewBusinessSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client new business and create a summary line if present.
    const clientNewBusiness = await db
      .select()
      .from(newBusiness)
      .where(inArray(newBusiness.clientId, clientIds));

    if (clientNewBusiness.length !== 0) {
      // Define private and sensitive data that may be present in the client new business data.
      const importantNewBusinessInfo = `Application Name, Plan Type, Have Premium Cheque Attached, Completed Questionnaires, Linked Files.`;
      const importantNewBusinessRecords = `Also contains a record that the following have been acquired: Pre-Printed Void Check & Debit Form, Replacement Form, Product Page, Financials, Signed Client Advisor Disclosure Copy, Signed FNA Copy.`;

      // Define the client new business summary string and return it.
      return ` - New Business: A collection of information for a new business checklist. Recorded to store information about the new business checklist for a client.\n Private or confidential data recorded in a new business checklist may include: ${importantNewBusinessInfo}\n ${importantNewBusinessRecords}.\n Created during the client creation process and later updated via the "New Business" section of a client. Data is stored until it is updated and overwritten, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client new business is present.
      return ` - New Business: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client new business summary.
  return { newBusiness: data };
}

// Create a summary line for the client key people data.
export async function createSettlingRequirementsSummary(clientIds: number[]) {
  const { data, error } = await mightFail(async () => {
    // Check for client settling requirements and create a summary line if present.
    const clientSettlingRequirements = await db
      .select()
      .from(settlingRequirements)
      .where(inArray(settlingRequirements.clientId, clientIds));

    if (clientSettlingRequirements.length !== 0) {
      // Define private and sensitive data that may be present in the client settling requirements data.
      const importantSettlingRequirements = `Policy Name and a record of if the following are completed: Needs Analysis, Policy Delivery Receipt, Void Cheque, Illustration, Amendment, Identification #, Product Page, Return of Original Policy, Return of Alternate Policy, Declaration of Continued Insurability, Cheque Amount $, PAC Authorization, Signed Illustration, Replacement Form, Surrender Request, In Force - No Requirements Needed, Not Taken, Endorsement, Return for Reissue`;

      // Define the client settling requirements summary string and return it.
      return ` - Settling Requirements: A collection of information for a settling requirements checklist. Recorded to store information about the settling requirements checklist for a client.\n Private or confidential data recorded in a settling requirements checklist may include:\n ${importantSettlingRequirements}.\n Created during the client creation process and later updated via the "Settling Requirements" section of a client. Data is stored until it is updated and overwritten, the owner client is deleted, or the account is deleted.\n\n`;
    } else {
      // Return a message indicating that no client settling requirements are present.
      return ` - Settling Requirements: N/A\n\n`;
    }
  });

  // Check for any errors, throwing them for catch and log at higher level.
  if (error) {
    throw error;
  }

  // Return the client settling requirements summary.
  return { settlingRequirements: data };
}
