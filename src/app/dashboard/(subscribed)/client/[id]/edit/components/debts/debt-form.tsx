import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { MoneyInput } from "@/components/money-input";
import { PercentageInput } from "@/components/percentage-input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  insertDebtSchema,
  type InsertDebt,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";
import type { BaseFormProps } from "@/constants/index";

interface DebtFormProps extends BaseFormProps {
  initialValues?: InsertDebt;
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//        And the submit button text, the submit loading text, the success message.
export function DebtForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    initialValue: 0,
    rate: 0,
    annualPayment: 0,
    yearAcquired: new Date().getFullYear(),
    term: 20,
  },
  submitButtonText,
  submitLoadingText,
  successMessage,
}: DebtFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert a Debt.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the insertDebtSchema and the initial values.
  const form = useForm<InsertDebt>({
    resolver: zodResolver(insertDebtSchema),
    defaultValues: initialValues,
  });

  // Execute the server action to insert a Debt with the Client Id and Debt Ids.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertDebt): Promise<string | void> {
    toast.promise(execute({ ...values, clientId, debtId: initialValues?.id }), {
      loading: submitLoadingText,
      success: () => {
        // Close the dialog, reset the form, and return the success message.
        onCloseDialog();
        form.reset();
        return successMessage;
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter debt name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MoneyInput
            form={form}
            name="initialValue"
            label="Initial Value"
            placeholder="$0.00"
          />
          <PercentageInput
            form={form}
            name="rate"
            label="Interest rate"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <MoneyInput
            form={form}
            name="annualPayment"
            label="Annual Payment"
            placeholder="$0.00"
          />
          <FormField
            control={form.control}
            name="yearAcquired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Acquired</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual term</FormLabel>
                <FormControl>
                  <Input placeholder="Between 0 and 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <FormSubmitButton
            isPending={isPending || form.formState.isSubmitting}
            value={submitButtonText}
            loadingValue={submitLoadingText}
          />
        </DialogFooter>
      </form>
    </Form>
  );
}
