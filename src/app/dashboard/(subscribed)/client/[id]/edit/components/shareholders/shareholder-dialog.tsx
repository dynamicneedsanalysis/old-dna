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
  createShareholder,
  editShareholder,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/actions";
import type {
  BusinessShareholder,
  Shareholder,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/schema";
import { ShareholderForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/shareholder-form";

type ShareholderDialogProps =
  | { mode: "add"; businesses: BusinessShareholder[] }
  | {
      mode: "edit";
      shareholder: Shareholder;
      businesses: BusinessShareholder[];
    };

// Takes: A mode (add or edit) and an array of Business Shareholder objects.
//        On edit mode, it also takes a Shareholder object.
export function ShareholderDialog(props: ShareholderDialogProps) {
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
            <span>Add Shareholder</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "Add Shareholder" : "Edit Shareholder"}
          </DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <ShareholderForm
            businesses={props.businesses}
            onCloseDialog={handleCloseDialog}
            serverAction={createShareholder}
            submitButtonText="Add Shareholder"
            submitLoadingText="Adding..."
            successMessage="Shareholder added successfully."
          />
        ) : (
          <ShareholderForm
            businesses={props.businesses}
            initialValues={{
              id: props.shareholder.id,
              name: props.shareholder.name,
              insuranceCoverage: parseFloat(
                props.shareholder.insuranceCoverage
              ),
              sharePercentage: parseFloat(props.shareholder.sharePercentage),
              business: {
                value: props.shareholder.businessId.toString(),
                label:
                  props.businesses.find(
                    (b) => b.id === props.shareholder.businessId
                  )?.name || "",
              },
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editShareholder}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Shareholder updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
