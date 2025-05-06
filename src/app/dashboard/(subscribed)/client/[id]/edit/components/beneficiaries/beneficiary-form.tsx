import { useParams } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { FormSubmitButton } from "@/components/form-submit-button";
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
  insertBeneficiarySchema,
  type InsertBeneficiary,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import type { BaseFormProps } from "@/constants/index";

interface BeneficiaryFormProps extends BaseFormProps {
  initialValues?: InsertBeneficiary;
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//        The submit button text, the submit loading text, and the success message.
export function BeneficiaryForm({
  onCloseDialog,
  serverAction,
  initialValues = { name: "", allocation: 0 },
  submitButtonText,
  submitLoadingText,
  successMessage,
}: BeneficiaryFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert a Beneficiary.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the insertBeneficiarySchema and the initial values.
  const form = useForm<InsertBeneficiary>({
    resolver: zodResolver(insertBeneficiarySchema),
    defaultValues: initialValues,
  });

  // Execute the server action to insert a Beneficiary with the Client and Beneficiary Ids.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertBeneficiary): Promise<string | void> {
    toast.promise(
      execute({ ...values, clientId, beneficiaryId: initialValues?.id }),
      {
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
      }
    );
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
                  <Input placeholder="Enter beneficiary name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allocation (parts)</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
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
