"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestDemo } from "@/app/(marketing)/contact-us/lib/actions";
import {
  requestDemoFormSchema,
  type RequestDemoFormSchema,
} from "@/app/(marketing)/contact-us/lib/schema";

export function RequestDemoForm() {
  // Initialize the server action with the requestDemo action.
  const { isPending, execute } = useServerAction(requestDemo);

  // Initialize the form with the RequestDemoFormSchema.
  const form = useForm<RequestDemoFormSchema>({
    resolver: zodResolver(requestDemoFormSchema),
    defaultValues: {
      workEmail: "",
      firstName: "",
      lastName: "",
      companyName: "",
      comment: "",
    },
  });

  // Takes: A typed RequestDemoFormSchema object.
  // Returns: A success or error message string.
  async function onSubmit(
    values: RequestDemoFormSchema
  ): Promise<string | void> {
    // Execute the requestDemo action with the form values.
    toast.promise(execute(values), {
      loading: "Submitting your request...",
      success: () => {
        form.reset();
        return "Your request has been submitted successfully.";
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
  }

  return (
    <Card className="w-full max-w-xl">
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="workEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your work email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your comment here...."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSubmitButton
              className="w-full"
              isPending={isPending || form.formState.isSubmitting}
              value="Submit"
              loadingValue="Submitting your request..."
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
