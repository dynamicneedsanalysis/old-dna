import { notFound } from "next/navigation";
import { getUser } from "@/lib/kinde";
import {
  selectSingleAsset,
  selectSingleBeneficiary,
  selectSingleBusiness,
  selectSingleClient,
  selectSingleDebt,
  selectSingleGoal,
} from "@/db/queries/index";
import { z } from "zod";
import { createServerActionProcedure } from "zsa";

// Preforms Kinde auth check as a procedure.
// Returns: The User object.
export const authProcedure = createServerActionProcedure().handler(async () => {
  const user = await getUser();
  return { user };
});

// Tales: A Client Id.
// Uses Client Id input with authProcedure to get Kinde User.
// Uses passed Client Id and returned Kinde Id to select a single Client from the database.
// Returns: The User, The passed Client Id, and the Client life expectancy.
export const ownsClientProcedure = createServerActionProcedure(authProcedure)
  .input(z.object({ clientId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { client, error } = await selectSingleClient({
      id: input.clientId,
      kindeId: ctx.user.id,
    });
    if (error) {
      throw error;
    }
    if (!client) {
      notFound();
    }
    return {
      user: ctx.user,
      clientId: client.id,
      lifeExpectancy: client.lifeExpectancy,
    };
  });

// Takes: A Business Id and a Client Id.
// Uses Business Id with ownsClientProcedure to get a Client Id.
// Uses passed Business Id and returned Client Id to select a single Business from the database.
// Returns: User, Client Id, and Business.
export const ownsBusinessProcedure = createServerActionProcedure(
  ownsClientProcedure
)
  .input(z.object({ businessId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { business, error } = await selectSingleBusiness({
      id: input.businessId,
      clientId: ctx.clientId,
    });

    if (error) {
      throw error;
    }
    if (!business) {
      notFound();
    }
    return {
      user: ctx.user,
      clientId: ctx.clientId,
      business,
    };
  });

// Takes: A Shareholder or Key Person Id.
// Uses the Entity Id with ownsBusinessProcedure to get a User, Client Id, and Business.
// Returns: User, Client Id, and Business.
export const ownsBusinessEntityProcedure = createServerActionProcedure(
  ownsBusinessProcedure
)
  .input(z.object({ entitytId: z.number() }))
  .handler(async ({ ctx }) => {
    return {
      user: ctx.user,
      clientId: ctx.clientId,
      business: ctx.business,
    };
  });

// Takes: A Beneficiary Id.
// Uses Beneficiary Id with ownsClientProcedure to get a Client Id.
// Uses passed Beneficiary Id and returned Client Id to select a single Beneficiary from the database.
// Returns: User, Client Id, and Beneficiary.
export const ownsBeneficiaryProcedure = createServerActionProcedure(
  ownsClientProcedure
)
  .input(z.object({ beneficiaryId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { beneficiary, error } = await selectSingleBeneficiary({
      id: input.beneficiaryId,
      clientId: ctx.clientId,
    });

    if (error) {
      throw error;
    }
    if (!beneficiary) {
      notFound();
    }

    return {
      user: ctx.user,
      clientId: ctx.clientId,
      beneficiary,
    };
  });

// Takes: A Debt Id.
// Uses Debt Id with ownsClientProcedure to get a Client Id.
// Uses passed Debt Id and returned Client Id to select a single Debt from the database.
// Returns: User, Client Id, and Debt.
export const ownsDebtProcedure = createServerActionProcedure(
  ownsClientProcedure
)
  .input(z.object({ debtId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { debt, error } = await selectSingleDebt({
      id: input.debtId,
      clientId: ctx.clientId,
    });
    if (error) {
      throw error;
    }
    if (!debt) {
      notFound();
    }

    return {
      user: ctx.user,
      clientId: ctx.clientId,
      debt,
    };
  });

// Takes: A Goal Id.
// Uses Goal Id with ownsClientProcedure to get a Client Id.
// Uses passed Goal Id and returned Client Id to select a single Goal from the database.
// Returns: User, Client Id, and Goal.
export const ownsGoalProcedure = createServerActionProcedure(
  ownsClientProcedure
)
  .input(z.object({ goalId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { goal, error } = await selectSingleGoal({
      id: input.goalId,
      clientId: ctx.clientId,
    });

    if (error) {
      throw new Error(error.message);
    }
    if (!goal) {
      throw new Error("Invalid goal id");
    }

    return {
      user: ctx.user,
      clientId: ctx.clientId,
      goal,
    };
  });

// Takes: An Asset Id.
// Uses Asset Id with ownsClientProcedure to get a Client Id.
// Uses passed Asset Id and returned Client Id to select a single Asset from the database.
// Returns: User, Client Id, Asset, and Life Expectancy.
export const ownsAssetProcedure = createServerActionProcedure(
  ownsClientProcedure
)
  .input(z.object({ assetId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const { asset, error } = await selectSingleAsset({
      id: input.assetId,
      clientId: ctx.clientId,
    });

    if (error) {
      throw error;
    }
    if (!asset) {
      throw new Error("Invalid asset id");
    }

    return {
      user: ctx.user,
      clientId: ctx.clientId,
      asset,
      lifeExpectancy: ctx.lifeExpectancy,
    };
  });
