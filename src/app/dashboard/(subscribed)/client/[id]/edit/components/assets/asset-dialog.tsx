"use client";

import { useState } from "react";
import { PenSquareIcon, PlusIcon } from "lucide-react";
import { useAssetBeneficiaries } from "@/hooks/asset/use-asset-beneficiaries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createAsset,
  editAsset,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/actions";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { AssetBeneficiaryAllocationWithAlreadyAssigned } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/beneficiary-allocation";
import { AssetForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/asset-form";

interface BaseAssetBeneficiaryDialogProps {
  beneficiaries: AssetBeneficiaryAllocationWithAlreadyAssigned[];
}
interface AddAssetDialogProps extends BaseAssetBeneficiaryDialogProps {
  mode: "add";
}
interface EditAssetDialogProps extends BaseAssetBeneficiaryDialogProps {
  mode: "edit";
  asset: Omit<Asset, "assetBeneficiaries">;
}
type AssetBeneficiaryDialogProps = AddAssetDialogProps | EditAssetDialogProps;

// Takes: A mode (add or edit), an array of Asset Beneficiaries, and an Asset object on edit mode.
// Omit "assetBeneficiaries" from the Asset object for edit mode.
export function AssetDialog(props: AssetBeneficiaryDialogProps) {
  // Determine mode, track open state, and define close dialog handler.
  const isAddMode = props.mode === "add";
  const [open, setOpen] = useState(false);

  function handleCloseDialog() {
    setOpen(false);
  }

  // Get initial and current Asset Beneficiaries, the set, edit, and toggle handlers.
  const {
    assetBeneficiaries,
    initialAssetBeneficiaries,
    setAssetBeneficiaries,
    onEditBeneficiary,
    onToggleBeneficiary,
  } = useAssetBeneficiaries({
    beneficiaries: props.beneficiaries,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isAddMode ? (
          <Button
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground my-4 space-x-1 rounded-full bg-transparent"
            variant="outline"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Asset</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100dvh-50px)] overflow-y-auto p-0 sm:max-w-[700px]"
        onCloseAutoFocus={() => {
          setAssetBeneficiaries(initialAssetBeneficiaries.current || []);
        }}
      >
        <DialogHeader className="bg-muted rounded-t-xl border-b p-4">
          <DialogTitle className="text-secondary font-bold">
            {isAddMode ? "Add Asset" : "Edit Asset"}
          </DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <AssetForm
            assetBeneficiaries={assetBeneficiaries}
            onEditBeneficiary={onEditBeneficiary}
            onToggleBeneficiary={onToggleBeneficiary}
            onCloseDialog={handleCloseDialog}
            serverAction={createAsset}
            submitButtonText="Add Asset"
            submitLoadingText="Adding..."
            successMessage="Asset added successfully."
          />
        ) : (
          <AssetForm
            initialValues={{
              id: props.asset.id,
              name: props.asset.name,
              yearAcquired: props.asset.yearAcquired,
              initialValue: parseFloat(props.asset.initialValue),
              currentValue: parseFloat(props.asset.currentValue),
              rate: parseFloat(props.asset.rate),
              term: props.asset.term ? parseFloat(props.asset.term) : null,
              type: props.asset.type,
              isTaxable: props.asset.isTaxable,
              isLiquid: props.asset.isLiquid,
              toBeSold: props.asset.toBeSold,
            }}
            assetBeneficiaries={assetBeneficiaries}
            onEditBeneficiary={onEditBeneficiary}
            onToggleBeneficiary={onToggleBeneficiary}
            onCloseDialog={handleCloseDialog}
            serverAction={editAsset}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Asset updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
