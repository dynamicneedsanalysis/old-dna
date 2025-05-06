import type { selectAllAssetsWithBeneficiaries } from "@/db/queries/index";

// Define and export a type based on the success result of the All Assets With Beneficiaries function.
export type AssetWithAssetBeneficiaries = NonNullable<
  Awaited<ReturnType<typeof selectAllAssetsWithBeneficiaries>>["assets"]
>[0];
