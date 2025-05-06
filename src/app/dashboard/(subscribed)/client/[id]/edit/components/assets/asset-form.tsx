import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { MoneyInput } from "@/components/money-input";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createInsertAssetSchema,
  type InsertAsset,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import { BeneficiaryAllocation } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/beneficiary-allocation";
import type { AssetBeneficiaryAllocationWithAlreadyAssigned } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/assets/beneficiary-allocation";
import {
  ASSET_TYPES,
  type BaseFormProps,
  MAX_INSURABLE_RATE,
} from "@/constants/index";

interface AssetBeneficiaryFormProps extends BaseFormProps {
  initialValues?: InsertAsset;
  onEditBeneficiary: (id: number, allocation: number) => void;
  onToggleBeneficiary: (id: number, alreadyAssigned: boolean) => void;
  assetBeneficiaries: AssetBeneficiaryAllocationWithAlreadyAssigned[];
}

// Takes: An onClose Dialog handler, a server action handler, the initial values,
//       The submit button text, the submit loading text, the success message,
//       An on Edit Beneficiary handler, an on Toggle Beneficiary handler,
//       And an array of Asset Beneficiary Allocation objects.
export function AssetForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    yearAcquired: new Date().getFullYear(),
    initialValue: 0.0,
    currentValue: 0.0,
    rate: 6,
    term: null,
    type: "Cash",
    isTaxable: false,
    isLiquid: false,
    toBeSold: false,
  },
  submitButtonText,
  submitLoadingText,
  successMessage,
  onEditBeneficiary,
  onToggleBeneficiary,
  assetBeneficiaries,
}: AssetBeneficiaryFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);

  // Define the server action to insert an Asset.
  const { isPending, execute } = useServerAction(serverAction);

  // Initialize the form with the createInsertAssetSchema and the initial values.
  const form = useForm<InsertAsset>({
    resolver: zodResolver(createInsertAssetSchema),
    defaultValues: { ...initialValues },
  });

  const [growthRateWarning, setGrowthRateWarning] = useState("");

  // Set watcher for changes to the toBeSold field.
  const toBeSold = form.watch("toBeSold");

  // Execute the server action to insert an Asset with the Client and Asset Ids, term, and Asset Beneficiaries.
  // Returns an success or error message (if error is of type Error).
  async function onSubmit(values: InsertAsset): Promise<string | void> {
    toast.promise(
      execute({
        ...values,
        ...(initialValues.id !== undefined && { assetId: initialValues.id }),
        clientId,
        term: values.term && toBeSold ? values.term : null,
        assetBeneficiaries: assetBeneficiaries
          .filter((b) => b.alreadyAssigned)
          .map((b) => {
            return {
              beneficiaryId: b.id,
              allocation: b.allocation,
            };
          }),
      }),
      {
        loading: submitLoadingText,
        success: () => {
          // Close the dialog, reset the form, and return the success message.
          onCloseDialog();
          form.reset(values);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 pt-0"
      >
        <div className="grid grid-cols-3 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your asset name" {...field} />
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
          <MoneyInput
            form={form}
            name="initialValue"
            label="Purchase Price"
            placeholder="$0.00"
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <MoneyInput
            form={form}
            name="currentValue"
            label="Current Value"
            placeholder="$0.00"
          />
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Growth Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute right-0 h-full border-l px-4"></div>
                      <div className="text-muted-foreground absolute top-[50%] right-3 translate-y-[-50%] text-sm">
                        %
                      </div>
                      <Input
                        className="pr-10"
                        placeholder="0 to 6"
                        type="text"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setGrowthRateWarning(
                            value < 0 || value > MAX_INSURABLE_RATE
                              ? "Should be between 0 and 12"
                              : ""
                          );
                          field.onChange(e);
                        }}
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  {growthRateWarning && (
                    <p className="text-sm font-medium text-yellow-600">
                      {growthRateWarning}
                    </p>
                  )}
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Horizon</FormLabel>
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
          <div className="col-span-2 flex justify-around">
            <FormField
              control={form.control}
              name="isTaxable"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Taxable</FormLabel>
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
            <FormField
              control={form.control}
              name="isLiquid"
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Liquid</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <BeneficiaryAllocation
          assetBeneficiaries={assetBeneficiaries}
          onEditBeneficiary={onEditBeneficiary}
          onToggleBeneficiary={onToggleBeneficiary}
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
