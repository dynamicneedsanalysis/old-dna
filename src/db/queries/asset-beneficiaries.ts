import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { assets, assetBeneficiaries, beneficiaries } from "@/db/schema/index";
import { and, eq, sql } from "drizzle-orm";
import type {
  AssetBeneficiary,
  InsertAsset,
  InsertAssetBeneficiary,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";

export const selectAllAssetsQuery = db
  .select({
    id: assets.id,
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
    clientId: assets.clientId,
    assetBeneficiaries: sql<AssetBeneficiary[]>`JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', ${assetBeneficiaries.id},
        'allocation', ${assetBeneficiaries.allocation},
        'assetId', ${assetBeneficiaries.assetId},
        'beneficiaryId', ${assetBeneficiaries.beneficiaryId},
        'beneficiaries', JSON_BUILD_OBJECT(
          'name', ${beneficiaries.name},
          'allocation', ${beneficiaries.allocation}
        )
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
  .prepare("get_all_assets");

// Takes: A Client Id.
// Selects all Assets, Asset Beneficiaries and Beneficiaries for a given Client Id.
// Returns: The Table of combined objects and the nullable error value.
export async function selectAllAssets(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectAllAssetsQuery.execute({ clientId })
  );
  return { assets: data, error };
}

// Takes: A Client Id.
// Selects all Assets for a given Client Id where the Asset has Beneficiaries.
// Returns: The Assets with Beneficiaries and the nullable error value.
export async function selectAllAssetsWithBeneficiaries(clientId: number) {
  const { data, error } = await mightFail(() =>
    db.query.assets.findMany({
      where: eq(assets.clientId, clientId),
      with: {
        assetBeneficiaries: {
          with: {
            beneficiaries: true,
          },
        },
      },
    })
  );
  return { assets: data, error };
}

// Takes: A Client Id and an Asset object without a Client Id,
//        And an array of Insert Beneficiary objects without an Asset Id.
// Inserts an the formatted values from the Insert Asset and Insert Asset Beneficiaries into the database.
// Returns: The nullable error value.
export const insertAssetWithBeneficiaries = async (
  clientId: number,
  asset: Omit<InsertAsset, "clientId">,
  beneficiaries: Omit<InsertAssetBeneficiary, "assetId">[]
) => {
  const { error } = await mightFail(async () => {
    const { insertedAssetId } = await db
      .insert(assets)
      .values({
        name: asset.name,
        initialValue: asset.initialValue.toString(),
        currentValue: asset.currentValue.toString(),
        yearAcquired: asset.yearAcquired,
        rate: asset.rate.toString(),
        term: asset.term ? asset.term.toString() : null,
        type: asset.type,
        isTaxable: asset.isTaxable,
        isLiquid: asset.isLiquid,
        toBeSold: asset.toBeSold,
        clientId,
      })
      .returning({ insertedAssetId: assets.id })
      .then((res) => res[0]);

    await db.insert(assetBeneficiaries).values(
      beneficiaries.map((beneficiary) => ({
        ...beneficiary,
        assetId: insertedAssetId,
        allocation: beneficiary.allocation.toString(),
      }))
    );
  });

  return { error };
};

// Takes: An Asset Id, an Asset object, and an array of Insert Beneficiary objects.
// Updates the matching Asset, remove all its Beneficiaries, and insert the new Beneficiaries.
// Returns: The nullable error value.
export const updateAssetWithBeneficiaries = async (
  assetId: number,
  assetData: InsertAsset,
  beneficiaries: Omit<InsertAssetBeneficiary, "assetId">[]
) => {
  const { error } = await mightFail(async () => {
    // Update the Asset table
    await db
      .update(assets)
      .set({
        name: assetData.name,
        initialValue: assetData.initialValue.toString(),
        currentValue: assetData.currentValue.toString(),
        yearAcquired: assetData.yearAcquired,
        rate: assetData.rate.toString(),
        term: assetData.term ? assetData.term.toString() : null,
        type: assetData.type,
        isTaxable: assetData.isTaxable,
        isLiquid: assetData.isLiquid,
        toBeSold: assetData.toBeSold,
      })
      .where(eq(assets.id, assetId));

    // Remove all Beneficiaries for the Asset before re-adding them
    await db
      .delete(assetBeneficiaries)
      .where(eq(assetBeneficiaries.assetId, assetId));

    // Insert the updated Asset Beneficiaries
    await db.insert(assetBeneficiaries).values(
      beneficiaries.map((beneficiary) => ({
        ...beneficiary,
        assetId,
        allocation: beneficiary.allocation.toString(),
      }))
    );
  });

  return { error };
};

const deleteAssetQuery = db
  .delete(assets)
  .where(
    and(
      eq(assets.id, sql.placeholder("assetId")),
      eq(assets.clientId, sql.placeholder("clientId"))
    )
  )
  .prepare("delete_single_asset");

// Takes: An Asset Id and a Client Id.
// Deletes the matching Asset with the given Id and Client Id.
// Returns: The deleted Asset's Id and the nullable error value.
export async function deleteAsset(assetId: number, clientId: number) {
  return await mightFail(() => deleteAssetQuery.execute({ assetId, clientId }));
}

const selectSingleAssetQuery = db
  .select()
  .from(assets)
  .where(
    and(
      eq(assets.id, sql.placeholder("id")),
      eq(assets.clientId, sql.placeholder("clientId"))
    )
  )
  .prepare("get_single_asset");

// Takes: An Asset Id and a Client Id.
// Selects a single Asset for a given Asset Id and Client Id.
// Returns: The Asset and the nullable error value.
export async function selectSingleAsset({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    selectSingleAssetQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { asset: data, error };
}
