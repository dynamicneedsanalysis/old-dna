import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  assets,
  assetBeneficiaries,
  type beneficiaries,
  clients,
} from "@/db/schema/index";
import type { selectAllAssetsQuery } from "@/db/queries/asset-beneficiaries";
import { MAX_TAX_FREEZE_AT_YEAR, MIN_TAX_FREEZE_AT_YEAR } from "@/constants";

export const editTaxFreezeAtYearSchema = createInsertSchema(clients, {
  taxFreezeAtYear: z.coerce
    .number()
    .min(
      MIN_TAX_FREEZE_AT_YEAR,
      `Must be at least the current year (${MIN_TAX_FREEZE_AT_YEAR})`
    )
    .max(
      MAX_TAX_FREEZE_AT_YEAR,
      `Must not exceed year ${MAX_TAX_FREEZE_AT_YEAR} (20 years from now)`
    ),
}).pick({
  taxFreezeAtYear: true,
});

// Define and export a type based on the editTaxFreezeAtYear schema.
export type EditTaxFreezeAtYear = z.infer<typeof editTaxFreezeAtYearSchema>;

export const createInsertAssetSchema = createInsertSchema(assets, {
  yearAcquired: z.coerce.number(),
  rate: z.coerce.number(),
  term: z.coerce
    .number()
    .min(1, { message: "Time Horizon must be greater than 0" })
    .nullable(),
  currentValue: z.coerce
    .number()
    .min(0.01, { message: "Current Value must be greater than $0.00" }),
  initialValue: z.coerce
    .number()
    .min(0.01, { message: "Initial Value must be greater than $0.00" }),
}).omit({ clientId: true });

export const insertSingleAssetBeneficiarySchema = createInsertSchema(
  assetBeneficiaries,
  {
    allocation: z.coerce
      .number()
      .min(0, { message: "Allocation must be greater than 0" })
      .max(100, { message: "Allocation cannot exceed 100" }),
  }
);

// Define and export a type of the success result of the selectAllAssetsQuery query.
export type Asset = Awaited<ReturnType<typeof selectAllAssetsQuery.execute>>[0];

type Beneficiary = typeof beneficiaries.$inferSelect;

// Define and export a type from the Asset Beneficiary schema with the createdAt field omitted.
// Also include a field that includes either the name or allocation value from a Beneficiary object.
export type AssetBeneficiary = Omit<
  typeof assetBeneficiaries.$inferSelect,
  "createdAt"
> & {
  beneficiaries: Pick<Beneficiary, "name" | "allocation">;
};

// Define and export types based on the insertAsset and insertAssetBeneficiary schemas.
export type InsertAsset = z.infer<typeof createInsertAssetSchema>;
export type InsertAssetBeneficiary = z.infer<
  typeof insertSingleAssetBeneficiarySchema
>;

export const insertAssetWithBeneficiariesSchema = createInsertAssetSchema.merge(
  z.object({
    assetBeneficiaries: z.array(
      insertSingleAssetBeneficiarySchema.pick({
        beneficiaryId: true,
        allocation: true,
      })
    ),
  })
);
