"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import { PencilIcon } from "lucide-react";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TaxFreezeAtYearClient } from "@/db/queries/clients";
import {
  editTaxFreezeAtYearSchema,
  type EditTaxFreezeAtYear,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import { editTaxFreezeAtYear } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/actions";

// Takes: A TaxFreezeAtYearClient object.
export function EditTaxFreezeAtYearDialog({
  client,
}: {
  client: TaxFreezeAtYearClient;
}) {
  const [open, setOpen] = useState(false);

  // Initialize form with editTaxFreezeAtYearSchema and default values.
  const form = useForm<EditTaxFreezeAtYear>({
    resolver: zodResolver(editTaxFreezeAtYearSchema),
    defaultValues: {
      taxFreezeAtYear: client.taxFreezeAtYear,
    },
  });

  // Define server action for editing the tax freeze year.
  const { isPending, execute } = useServerAction(editTaxFreezeAtYear);

  function handleCloseDialog() {
    setOpen(false);
  }

  // Execute the server action to edit the freeze year of the Client with the Client Id.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: EditTaxFreezeAtYear): Promise<string | void> {
    toast.promise(execute({ ...values, clientId: client.id }), {
      loading: "Updating...",
      success: () => {
        // Close the dialog, reset the form, and return the success message.
        handleCloseDialog();
        form.reset();
        return "Tax freeze at year updated successfully.";
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center gap-2">
          <PencilIcon className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[500px]">
        <DialogHeader className="bg-muted rounded-t-xl border-b p-4">
          <DialogTitle className="font-bold">Edit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6 pt-0"
          >
            <FormField
              control={form.control}
              name="taxFreezeAtYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Freeze At Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <FormSubmitButton
                isPending={isPending}
                loadingValue="Saving..."
                value="Save Changes"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
