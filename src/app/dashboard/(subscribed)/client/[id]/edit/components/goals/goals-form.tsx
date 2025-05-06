import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";

import { MoneyInput } from "@/components/money-input";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Checkbox } from "@/components/ui/checkbox";
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
  insertGoalSchema,
  type InsertGoal,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";
import type { BaseFormProps } from "@/constants/index";

interface GoalsPhilanthropyFormProps extends BaseFormProps {
  initialValues?: InsertGoal;
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//        And the submit button text, the submit loading text, the success message.
export function GoalForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    amount: 0,
    isPhilanthropic: false,
  },

  submitButtonText,
  submitLoadingText,
  successMessage,
}: GoalsPhilanthropyFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert a Goal.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the insertGoalSchema and the initial values.
  const form = useForm<InsertGoal>({
    resolver: zodResolver(insertGoalSchema),
    defaultValues: initialValues,
  });

  // Execute the server action to insert a Goal with the Client and Goal Ids.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertGoal): Promise<string | void> {
    toast.promise(execute({ ...values, clientId, goalId: initialValues?.id }), {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Enter goal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MoneyInput
            form={form}
            name="amount"
            label="Desired funding amount"
            placeholder="$0.00"
          />
        </div>
        <FormField
          control={form.control}
          name="isPhilanthropic"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-end space-y-0 space-x-2.5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Is philanthropic?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
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
