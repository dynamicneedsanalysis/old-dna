import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitButton } from "@/components/form-submit-button";
import { MoneyInput } from "@/components/money-input";
import { PercentageInput } from "@/components/percentage-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  insertBusinessSchema,
  type InsertBusiness,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";
import type { BaseFormProps } from "@/constants/index";

interface BusinessFormProps extends BaseFormProps {
  initialValues?: InsertBusiness;
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//        The submit button text, the submit loading text, and the success message.
export function BusinessForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    valuation: 0,
    ebitda: 0,
    appreciationRate: 6,
    term: 20,
    clientSharePercentage: 100,
    clientShareholderInsuranceContribution: 0,
    clientEbitdaContributed: 100,
    clientEbitdaInsuranceContribution: 0,
    purchasePrice: 0,
    yearAcquired: new Date().getFullYear(),
    toBeSold: false,
  },
  submitButtonText,
  submitLoadingText,
  successMessage,
}: BusinessFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert a Business.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the insertBusinessSchema and the initial values.
  const form = useForm<InsertBusiness>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: initialValues,
  });

  // Set watcher for changes to the toBeSold field.
  const toBeSold = form.watch("toBeSold");

  // Execute the server action to insert a Business with the Client and Business Ids and the term.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertBusiness): Promise<string | void> {
    toast.promise(
      execute({
        ...values,
        clientId,
        businessId: initialValues?.id,
        term: values.term && toBeSold ? values.term : null,
      }),
      {
        loading: submitLoadingText,
        success: () => {
          // Close the dialog, reset the form, and return the success message
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
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearAcquired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Acquired</FormLabel>
                <FormControl>
                  <Input placeholder="YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <MoneyInput
            form={form}
            name="purchasePrice"
            label="Purchase Price"
            placeholder="$0.00"
          />
          <PercentageInput
            form={form}
            name="appreciationRate"
            label="Growth Rate"
            placeholder="Between 0 and 6"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <MoneyInput
            form={form}
            name="valuation"
            label="Market Value"
            placeholder="$0.00"
          />
          <MoneyInput
            form={form}
            name="ebitda"
            label="Corporation's Ebitda"
            placeholder="$0.00"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Horizon (years)</FormLabel>
                <FormControl>
                  <Input
                    placeholder={toBeSold ? "Enter a number (0 or more)" : ""}
                    {...field}
                    value={toBeSold && field.value ? field.value : ""}
                    disabled={!toBeSold}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toBeSold"
            render={({ field }) => (
              <FormItem className="flex items-end gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(e) => {
                      const isSold = e.valueOf();

                      if (isSold) {
                        const currentTerm = form.getValues("term");
                        if (!!currentTerm) {
                          form.setValue("term", currentTerm);
                        } else {
                          form.setValue("term", 20);
                        }
                      } else {
                        form.setValue("term", null);
                      }

                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormLabel>To be Sold</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <PercentageInput
                form={form}
                name="clientSharePercentage"
                label="Share Percentage"
                placeholder="0"
              />
              <MoneyInput
                form={form}
                name="clientShareholderInsuranceContribution"
                label="Shareholder Insurance Contribution"
                placeholder="$0.00"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <PercentageInput
                form={form}
                name="clientEbitdaContributed"
                label="EBITDA Contributed"
                placeholder="0"
              />
              <MoneyInput
                form={form}
                name="clientEbitdaInsuranceContribution"
                label="EBITDA Insurance Contribution"
                placeholder="$0.00"
              />
            </div>
          </CardContent>
        </Card>
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
