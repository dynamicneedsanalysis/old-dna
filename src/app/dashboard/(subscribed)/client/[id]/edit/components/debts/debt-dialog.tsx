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
import {
  createDebt,
  editDebt,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/actions";
import type { Debt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";
import { DebtForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/debt-form";

type DebtDialogProps = { mode: "add" } | { mode: "edit"; debt: Debt };

// Takes: A mode (add or edit) and a Debt object on edit mode.
export function DebtDialog(props: DebtDialogProps) {
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
            <span>Add Debt</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{isAddMode ? "Add Debt" : "Edit Debt"}</DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <DebtForm
            onCloseDialog={handleCloseDialog}
            serverAction={createDebt}
            submitButtonText="Add Debt"
            submitLoadingText="Adding..."
            successMessage="Debt added successfully."
          />
        ) : (
          <DebtForm
            initialValues={{
              id: props.debt.id,
              name: props.debt.name,
              initialValue: parseFloat(props.debt.initialValue),
              rate: parseFloat(props.debt.rate),
              annualPayment: parseFloat(props.debt.annualPayment),
              yearAcquired: props.debt.yearAcquired,
              term: parseFloat(props.debt.term),
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editDebt}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Debt updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
