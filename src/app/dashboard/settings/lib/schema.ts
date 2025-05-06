import { z } from "zod";

export const contactFormSchema = z.object({
  subject: z.string().trim().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  message: z.string().trim().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

// Export the inferred type of the contactForm schema.
export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const insertAdvisorSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Must be 1 or more characters long" })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Must be 1 or more characters long" })
    .trim(),
  agencyName: z.string().trim(),
  certifications: z.string().trim(),
  streetAddress: z.string().trim(),
  city: z.string().trim(),
  provinceOrState: z.string().trim(),
  postcode: z.string().trim(),
  licensedProvinces: z.array(z.string()),
  insurers: z.array(z.string()),
});

// Export the inferred type of the insertAdvisor schema.
export type InsertAdvisor = z.infer<typeof insertAdvisorSchema>;

export const requestDataInput = z.object({
  emailAddress: z.string().email(),
  sendSummary: z.boolean(),
  sendRecords: z.boolean(),
});
