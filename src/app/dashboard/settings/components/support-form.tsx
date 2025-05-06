"use client";

import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { contactSupport } from "@/app/dashboard/settings/actions";
import {
  contactFormSchema,
  type ContactFormSchema,
} from "@/app/dashboard/settings/lib/schema";

export function SupportForm() {
  // Create a form with the ContactFormSchema.
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Define the server action to contact support.
  const { isPending, execute } = useServerAction(contactSupport);

  // On submission, execute the contact support server action.
  // If successful, reset the form and display a success message.
  // On error, display the returned error message.
  async function onSubmit(values: ContactFormSchema) {
    toast.promise(execute(values), {
      loading: "Please wait...",
      success: () => {
        form.reset();
        return "Thank you, we will get back to you soon.";
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your message here...."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          value="Submit"
          isPending={isPending}
          loadingValue="Submitting..."
        />
      </form>
    </Form>
  );
}
