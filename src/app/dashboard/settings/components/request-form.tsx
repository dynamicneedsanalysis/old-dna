"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendRequestedData } from "@/app/dashboard/settings/actions";

export default function RequestForm() {
  // Define server action for sending requested data.
  const { isPending, execute } = useServerAction(sendRequestedData);

  // Define form schema. (Recipient Email, send data summary, & send data record)
  const schema = z.object({
    emailAddress: z.string().email(),
    sendSummary: z.boolean(),
    sendRecords: z.boolean(),
  });

  // Define form state and initial values.
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { emailAddress: "", sendSummary: false, sendRecords: false },
  });

  // Define form submit handler.
  async function onSubmit(values: {
    emailAddress: string;
    sendSummary: boolean;
    sendRecords: boolean;
  }) {
    // Execute the server action to send requested data using form data.
    toast.promise(execute(values), {
      loading: "Please wait...",
      success: (result) => {
        // If a non-success result is returned, throw an error.
        if (result[0] !== "Success") {
          throw "Failed to send data request.";
        }
        // If successful, reset the form and return a success message to the toast notification.
        form.reset();
        return "Thank you, your requested data has been sent.";
      },
      error: (error) => {
        // If an error occurs, return the error message to the toast notification.
        // Will always use the string from the error thrown in the success block.
        return error instanceof Error ? error.message : error;
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-fit flex-col justify-evenly gap-6 sm:w-full sm:flex-row">
          <FormField
            control={form.control}
            name="sendSummary"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <span className="flex h-7 items-center">
                      <Checkbox
                        className="size-4"
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange({ target: { value: !field.value } });
                        }}
                      />
                    </span>
                  </FormControl>
                  <div>
                    <FormLabel className="text-lg">Data Summary</FormLabel>
                    <FormDescription>
                      <span className="mb-2 text-sm">
                        Get a summary of all data we have collected from you.
                      </span>
                    </FormDescription>
                    <ul className="text-sm text-gray-500">
                      <li className="ml-4 list-disc py-1">
                        What information that data contains.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        What purpose the the data was collected for.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        Where and how was the data collected.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        How long the data will be retained.
                      </li>
                    </ul>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sendRecords"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <span className="flex h-7 items-center">
                      <Checkbox
                        className="size-4"
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange({ target: { value: !field.value } });
                        }}
                      />
                    </span>
                  </FormControl>
                  <div>
                    <FormLabel className="text-lg">Data Report</FormLabel>
                    <FormDescription>
                      <span className="mb-2 text-sm">
                        Get a file of all data we have collected from you.
                      </span>
                    </FormDescription>
                    <ul className="text-sm text-gray-500">
                      <li className="ml-4 list-disc py-1">
                        Provides a complete record of all data collected.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        Separates data records by client.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        Gets the URLs for all uploaded client files.
                      </li>
                      <li className="ml-4 list-disc py-1">
                        Creates a JSON formatted file.
                      </li>
                    </ul>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 flex flex-row items-end justify-evenly gap-4">
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel className="text-lg">
                  Recipient Email Address
                </FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSubmitButton
            className="w-1/4"
            isPending={form.formState.isSubmitting || isPending}
            disabled={
              !form.getValues("sendSummary") && !form.getValues("sendRecords")
            }
            value="Send Data"
            loadingValue="Sending..."
          />
        </div>
      </form>
    </Form>
  );
}
