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
  createBusiness,
  editBusiness,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/actions";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";
import { BusinessForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/business-form";

type BusinessDialogProps =
  | { mode: "add" }
  | { mode: "edit"; business: Business };

// Takes: A mode (add or edit) and a Business object on edit mode.
export function BusinessDialog(props: BusinessDialogProps) {
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
            <span>Add Business</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "Add Business" : "Edit Business"}
          </DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <BusinessForm
            onCloseDialog={handleCloseDialog}
            serverAction={createBusiness}
            submitButtonText="Add Business"
            submitLoadingText="Adding..."
            successMessage="Business added successfully."
          />
        ) : (
          <BusinessForm
            initialValues={{
              id: props.business.id,
              name: props.business.name,
              valuation: parseFloat(props.business.valuation),
              ebitda: parseFloat(props.business.ebitda),
              term: props.business.term
                ? parseFloat(props.business.term)
                : null,
              appreciationRate: parseFloat(props.business.appreciationRate),
              clientSharePercentage: parseFloat(
                props.business.clientSharePercentage
              ),
              clientShareholderInsuranceContribution: parseFloat(
                props.business.clientShareholderInsuranceContribution
              ),
              clientEbitdaContributed: parseFloat(
                props.business.clientEbitdaContributed
              ),
              clientEbitdaInsuranceContribution: parseFloat(
                props.business.clientEbitdaInsuranceContribution
              ),
              purchasePrice: parseFloat(props.business.purchasePrice),
              yearAcquired: props.business.yearAcquired,
              toBeSold: props.business.toBeSold,
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editBusiness}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Business updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
