import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as assets from "@/db/schema/assets";
import * as beneficiaries from "@/db/schema/beneficiaries";
import * as assetBeneficiaries from "@/db/schema/assetBeneficiaries";
import * as budgets from "@/db/schema/budgets";
import * as businesses from "@/db/schema/businesses";
import * as debts from "@/db/schema/debts";
import * as goals from "@/db/schema/goals";
import * as keyPeople from "@/db/schema/keyPeople";
import * as shareholders from "@/db/schema/shareholders";
import * as clients from "@/db/schema/clients";
import * as subscriptions from "@/db/schema/subscriptions";
import { config } from "dotenv";
import * as invitations from "./schema/invitations";
config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: {
    ...clients,
    ...businesses,
    ...keyPeople,
    ...shareholders,
    ...assets,
    ...debts,
    ...goals,
    ...beneficiaries,
    ...assetBeneficiaries,
    ...budgets,
    ...invitations,
    ...subscriptions,
  },
});
