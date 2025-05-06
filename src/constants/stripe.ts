import { absoluteUrl } from "@/lib/utils";
import { z } from "zod";

// Create a schema from the combined monthly and annually Plan types.
export const planSchema = z.union([
  z.literal("monthly"),
  z.literal("annually"),
]);

export type Plan = z.infer<typeof planSchema>;

// Add prefix to URL's based on the environment before ENV constant definition.
const settingsUrl = absoluteUrl("/dashboard/settings/billing");
const clientsUrl = absoluteUrl("/dashboard/clients");

export const CANCEL_URL = settingsUrl;
export const RETURN_URL = clientsUrl;
export const SUCCESS_URL = clientsUrl;
