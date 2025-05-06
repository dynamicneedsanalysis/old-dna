import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { calculateAgeFromDate, findSelectedBracket } from "@/lib/client/utils";
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
  insertClientSchema,
  type InsertClient,
} from "@/app/dashboard/(subscribed)/clients/lib/schema";
import {
  type BaseFormProps,
  HEALTH_CLASSES,
  CANADIAN_PROVINCES,
  type ProvinceInitials,
  SEX_OPTIONS,
} from "@/constants/index";

interface ClientFormProps extends BaseFormProps {
  initialValues?: InsertClient;
}

// Takes: On close dialogue and server action handlers, and an initial values object,
//        Also takes submit button text, submit loading text, and a success message.
export function ClientForm({
  onCloseDialog,
  serverAction,
  initialValues = {
    name: "",
    annualIncome: 0.0,
    birthDate: new Date(),
    province: "BC",
    lifeExpectancy: 86,
    smokingStatus: false,
    health: "P",
    sex: "F",
  },
  submitButtonText,
  submitLoadingText,
  successMessage,
}: ClientFormProps) {
  const params = useParams<{ id: string }>();
  const clientId = Number.parseInt(params.id);
  const { isPending, execute } = useServerAction(serverAction);

  // Create form for Insert Client using the passed initial values.
  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: initialValues,
  });

  // Define values for age and tax bracket dynamically determined from form values.
  const age = calculateAgeFromDate(form.watch("birthDate"));

  const taxBracket = findSelectedBracket(
    form.watch("province"),
    form.watch("annualIncome")
  );

  async function onSubmit(values: InsertClient) {
    // Execute the server action with the form values and Client Id.
    // On success, close the dialogue and reset the form.
    // On error, show the error message.
    toast.promise(execute({ ...values, clientId }), {
      loading: submitLoadingText,
      success: () => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min="1900-01-01"
                    max={format(new Date(), "yyyy-MM-dd")}
                    defaultValue={format(field.value, "yyyy-MM-dd")}
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.keys(CANADIAN_PROVINCES) as ProvinceInitials[]
                      ).map((provinceInitial) => (
                        <SelectItem
                          key={provinceInitial}
                          value={provinceInitial}
                        >
                          {CANADIAN_PROVINCES[provinceInitial]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MoneyInput
            form={form}
            name="annualIncome"
            label="Annual Income"
            placeholder="0.00"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-sm leading-none font-medium">Age</h2>
            <div className="font-bold">{age}</div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm leading-none font-medium">Tax Bracket</h2>
            <div className="font-bold">
              ${taxBracket.minIncome} and up - {taxBracket.taxRate}%
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="lifeExpectancy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Life Expectancy</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEX_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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

        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="health"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Class</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health class" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEALTH_CLASSES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smokingStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Is currently a smoker?
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <FormSubmitButton
            isPending={isPending}
            loadingValue={submitLoadingText}
            value={submitButtonText}
          />
        </DialogFooter>
      </form>
    </Form>
  );
}
