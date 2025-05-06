import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import { FormSubmitButton } from "@/components/form-submit-button";
import { MoneyInput } from "@/components/money-input";
import { PercentageInput } from "@/components/percentage-input";
import { AutoComplete } from "@/components/ui/autocomplete";
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
  insertKeyPersonSchema,
  type BusinessKeyPerson,
  type InsertKeyPerson,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";
import type { BaseFormProps } from "@/constants/index";

interface KeyPersonFormProps extends BaseFormProps {
  initialValues?: InsertKeyPerson;
  businesses: BusinessKeyPerson[];
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//        The submit button text, the submit loading text, the success message,
//        And an array of Business Key Person objects.
export function KeyPersonForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    insuranceCoverage: 0,
    ebitdaContributionPercentage: 0,
    business: {
      value: "",
      label: "",
    },
  },
  submitButtonText,
  submitLoadingText,
  successMessage,
  businesses,
}: KeyPersonFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert a Key Person.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the insertKeyPersonSchema and the initial values.
  const form = useForm<InsertKeyPerson>({
    resolver: zodResolver(insertKeyPersonSchema),
    defaultValues: initialValues,
  });

  // Execute the server action on form submit with the form values and the Client, Business, and Key Person Ids.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertKeyPerson): Promise<string | void> {
    toast.promise(
      execute({
        ...values,
        clientId,
        businessId: Number.parseInt(values.business.value),
        keyPersonId: initialValues?.id,
      }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter key person name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 items-center gap-4">
          <PercentageInput
            form={form}
            label="EBITDA Contributed"
            name="ebitdaContributionPercentage"
            placeholder="0"
          />
          <MoneyInput
            form={form}
            name="insuranceCoverage"
            label="Insurance Coverage"
            placeholder="$0.00"
          />
        </div>
        <FormField
          control={form.control}
          name="business"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business</FormLabel>
              <FormControl>
                <AutoComplete
                  value={field.value}
                  options={businesses.map((b) => ({
                    value: `${b.id}`,
                    label: b.name,
                  }))}
                  onValueChange={field.onChange}
                  placeholder="Select a business..."
                  emptyMessage="No business found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <FormSubmitButton
            isPending={isPending || form.formState.isSubmitting}
            loadingValue={submitLoadingText}
            value={submitButtonText}
          />
        </DialogFooter>
      </form>
    </Form>
  );
}
