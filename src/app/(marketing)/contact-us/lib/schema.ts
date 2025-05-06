import { z } from "zod";

export const requestDemoFormSchema = z.object({
  workEmail: z.string().email("Invalid work email address"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  comment: z.string().trim().optional(),
});

// Export the inferred type of the requestDemoForm schema.
export type RequestDemoFormSchema = z.infer<typeof requestDemoFormSchema>;
