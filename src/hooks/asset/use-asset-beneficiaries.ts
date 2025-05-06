import { useEffect, useRef, useState } from "react";
import type { AssetBeneficiaryAllocationWithAlreadyAssigned } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/beneficiary-allocation";

// Takes: An array of objects representing the Beneficiaries.
// Returns: An array of Asset Beneficiaries and the initial Beneficiaries (same type as input),
//          A setter handler, an edit handler, and a toggle handler.
export function useAssetBeneficiaries({
  beneficiaries,
}: {
  beneficiaries: AssetBeneficiaryAllocationWithAlreadyAssigned[];
}) {
  // Track the current state of the Asset Beneficiaries and the initial state.
  const [assetBeneficiaries, setAssetBeneficiaries] = useState<
    AssetBeneficiaryAllocationWithAlreadyAssigned[]
  >([]);
  const initialAssetBeneficiaries =
    useRef<AssetBeneficiaryAllocationWithAlreadyAssigned[]>(undefined);

  // Set the Asset Beneficiaries to the input Beneficiaries and record the initial state.
  useEffect(() => {
    setAssetBeneficiaries(beneficiaries);
    initialAssetBeneficiaries.current = beneficiaries;
  }, [beneficiaries]);

  // Takes: The Id of a Beneficiary and an allocation.
  // Updates the related Beneficiary with the new allocation.
  function onEditBeneficiary(id: number, allocation: number) {
    setAssetBeneficiaries(
      assetBeneficiaries.map((beneficiary) =>
        beneficiary.id === id
          ? {
              ...beneficiary,
              allocation,
            }
          : beneficiary
      )
    );
  }

  // Takes: The Id of a Beneficiary and an 'already assigned' boolean.
  // Updates the related Beneficiary with the new 'already assigned' value.
  // Also sets the allocation to 0 if the Beneficiary is not assigned.
  function onToggleBeneficiary(id: number, alreadyAssigned: boolean) {
    setAssetBeneficiaries(
      assetBeneficiaries.map((beneficiary) =>
        beneficiary.id === id
          ? {
              ...beneficiary,
              allocation: !alreadyAssigned ? 0 : beneficiary.allocation,
              alreadyAssigned,
            }
          : beneficiary
      )
    );
  }

  return {
    assetBeneficiaries,
    initialAssetBeneficiaries,
    setAssetBeneficiaries,
    onEditBeneficiary,
    onToggleBeneficiary,
  };
}
