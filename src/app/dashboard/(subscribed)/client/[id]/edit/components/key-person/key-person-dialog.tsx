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
  createKeyPerson,
  editKeyPerson,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/actions";
import type {
  BusinessKeyPerson,
  KeyPerson,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";
import { KeyPersonForm } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/key-person-form";

type KeyPersonDialogProps =
  | { mode: "add"; businesses: BusinessKeyPerson[] }
  | {
      mode: "edit";
      keyPerson: KeyPerson;
      businesses: BusinessKeyPerson[];
    };

// Takes: A mode (add or edit) and an array of Business Key Person objects.
//        On edit mode, it also takes a Key Person object.
export function KeyPersonDialog(props: KeyPersonDialogProps) {
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
            <span>Add Key Person</span>
          </Button>
        ) : (
          <PenSquareIcon className="h-6 w-6 hover:cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "Add Key Person" : "Edit Key Person"}
          </DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <KeyPersonForm
            businesses={props.businesses}
            onCloseDialog={handleCloseDialog}
            serverAction={createKeyPerson}
            submitButtonText="Add Key Person"
            submitLoadingText="Adding..."
            successMessage="Key person added successfully."
          />
        ) : (
          <KeyPersonForm
            businesses={props.businesses}
            initialValues={{
              id: props.keyPerson.id,
              name: props.keyPerson.name,
              insuranceCoverage: parseFloat(props.keyPerson.insuranceCoverage),
              ebitdaContributionPercentage: parseFloat(
                props.keyPerson.ebitdaContributionPercentage
              ),
              business: {
                value: props.keyPerson.businessId.toString(),
                label:
                  props.businesses.find(
                    (b) => b.id === props.keyPerson.businessId
                  )?.name || "",
              },
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editKeyPerson}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Key person updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
