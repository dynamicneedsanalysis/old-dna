"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { FormSubmitButton } from "@/components/form-submit-button";
import { PercentageInput } from "@/components/percentage-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { editLiquidityAllocatedTowardsGoals } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/actions";
import {
  editLiquidityAllocatedTowardsGoalsSchema,
  type EditLiquidityAllocatedTowardsGoals,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";
import type { LiquidityAllocatedTowardsGoalsClient } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/goals/liquidity-allocated-towards-goals-edit";

// Takes an object in the format {id: string, liquidityAllocatedTowardsGoals: string}.
export function EditLiquidityAllocatedTowardsGoalsDialog({
  client,
}: {
  client: LiquidityAllocatedTowardsGoalsClient;
}) {
  const [open, setOpen] = useState(false);

  // Initialize form using editLiquidityAllocatedTowardsGoalsSchema and default values.
  const form = useForm<EditLiquidityAllocatedTowardsGoals>({
    resolver: zodResolver(editLiquidityAllocatedTowardsGoalsSchema),
    defaultValues: {
      liquidityAllocatedTowardsGoals: parseFloat(
        client.liquidityAllocatedTowardsGoals
      ),
    },
  });

  // Define server action for editing liquidity allocated towards Goals.
  const { isPending, execute } = useServerAction(
    editLiquidityAllocatedTowardsGoals
  );

  function handleCloseDialog() {
    setOpen(false);
  }

  // On form submission, execute the server action with the form values.
  async function onSubmit(
    values: EditLiquidityAllocatedTowardsGoals
  ): Promise<string | void> {
    toast.promise(execute({ ...values, clientId: client.id }), {
      loading: "Updating...",
      success: () => {
        // Close the dialog, reset the form, and return a success message.
        handleCloseDialog();
        form.reset();
        return "Liquidity updated successfully.";
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
            <PercentageInput
              form={form}
              name="liquidityAllocatedTowardsGoals"
              label="Liquidity Allocated Towards Goals"
              placeholder="0"
            />
            <DialogFooter>
              <FormSubmitButton
                disabled={!form.formState.isValid}
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
