"use client";

import { useState } from "react";
import { PenSquareIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import {
  createBeneficiary,
  editBeneficiary,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/actions";
import { BeneficiaryForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/beneficiary-form";

type BeneficiaryDialogProps =
  | { mode: "add" }
  | { mode: "edit"; beneficiary: Beneficiary };

// Takes: A mode (add or edit) and a Beneficiary object on edit mode.
export function BeneficiaryDialog(props: BeneficiaryDialogProps) {
  // Determine mode, track open state, and define close dialog handler.
  const isAddMode = props.mode === "add";
  const [open, setOpen] = useState(false);
  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isAddMode ? (
          <Button
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground my-4 space-x-1 rounded-full bg-transparent"
            variant="outline"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Beneficiary</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "Add Beneficiary" : "Edit Beneficiary"}
          </DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <BeneficiaryForm
            onCloseDialog={handleCloseDialog}
            serverAction={createBeneficiary}
            submitButtonText="Add Beneficiary"
            submitLoadingText="Adding..."
            successMessage="Beneficiary added successfully."
          />
        ) : (
          <BeneficiaryForm
            initialValues={{
              id: props.beneficiary.id,
              name: props.beneficiary.name,
              allocation: parseFloat(props.beneficiary.allocation),
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editBeneficiary}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Beneficiary updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
