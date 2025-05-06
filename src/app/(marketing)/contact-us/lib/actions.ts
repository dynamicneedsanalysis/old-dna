"use server";

import { createServerAction } from "zsa";
import { Resend } from "resend";
import { RequestDemoEmail } from "@/components/emails/request-demo-form";
import { requestDemoFormSchema } from "@/app/(marketing)/contact-us/lib/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

// Takes: Request demo form input.
// Create and send a demo request email using form data.
// Returns: A CreateEmailResponseSuccess object or null on error.
export const requestDemo = createServerAction()
  .input(requestDemoFormSchema)
  .handler(async ({ input }) => {
    const { data, error } = await resend.emails.send({
      from: "Dynamic Needs Analysis <no-reply@dynamicneedsanalysis.com>",
      to: ["dynamicneedsanalysis@gmail.com"],
      subject: "Demo Request",
      react: RequestDemoEmail({
        workEmail: input.workEmail,
        firstName: input.firstName,
        lastName: input.lastName,
        companyName: input.companyName,
        comment: input.comment,
      }),
    });

    if (error instanceof Error) {
      console.log(error.message);
      throw new Error("Failed to send email");
    }

    return data;
  });
