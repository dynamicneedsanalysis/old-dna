"use client";

import { useState } from "react";
import { getDateInUtc } from "@/lib/client/utils";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/client/client-form";
import { createNewClient } from "@/app/dashboard/(subscribed)/clients/lib/actions";
import type { Client } from "@/app/dashboard/(subscribed)/clients/lib/schema";
import { editClient } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/client/actions";

type ClientDialogProps = { mode: "add" } | { mode: "edit"; client: Client };

// Takes: Object containing (mode: "add") OR (mode: "edit", client: Client)
export function ClientDialog(props: ClientDialogProps) {
  // Define UI state based on the mode.
  const isAddMode = props.mode === "add";
  const [open, setOpen] = useState(false);
  function handleCloseDialog() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isAddMode ? (
          <Button className="my-4 space-x-1 rounded-full">
            <PlusIcon className="h-5 w-5" />
            <span>Add Client</span>
          </Button>
        ) : (
          <Button className="flex items-center gap-2">
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isAddMode ? "Add Client" : "Edit Client"}</DialogTitle>
        </DialogHeader>
        {isAddMode ? (
          <ClientForm
            onCloseDialog={handleCloseDialog}
            serverAction={createNewClient}
            submitButtonText="Add Client"
            submitLoadingText="Adding..."
            successMessage="Client added successfully."
          />
        ) : (
          <ClientForm
            initialValues={{
              name: props.client.name,
              annualIncome: parseFloat(props.client.annualIncome),
              birthDate: getDateInUtc(props.client.birthDate),
              province: props.client.province,
              lifeExpectancy: props.client.lifeExpectancy,
              health: props.client.health,
              sex: props.client.sex,
              smokingStatus: props.client.smokingStatus,
            }}
            onCloseDialog={handleCloseDialog}
            serverAction={editClient}
            submitButtonText="Save Changes"
            submitLoadingText="Saving..."
            successMessage="Client updated successfully."
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
