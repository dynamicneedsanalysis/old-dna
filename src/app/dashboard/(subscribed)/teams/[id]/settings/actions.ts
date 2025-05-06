"use server";

import {
  selectSubscription,
  updateSubscription,
} from "@/db/queries/subscriptions";
import { stripe } from "@/lib/stripe/utils";
import { getAccessToken } from "@/lib/kinde";
import {
  deleteOrganization,
  updateOrganization,
} from "@/lib/kinde/organizations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { mightFail } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { invitations } from "@/db/schema/invitations";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function updateTeam(teamName: string, orgId: string) {
  const { getUser, getRoles, refreshTokens } = getKindeServerSession();
  const user = await getUser();
  const roles = await getRoles();
  const accessToken = await getAccessToken();
  if (!user || !accessToken || !roles) {
    throw new Error("Failed to fetch user profile");
  }

  const isOwner = roles.some((role) => role.key === "owner");
  if (!isOwner) {
    throw new Error("User does not have permission to delete organization");
  }

  const updatedOrg = await updateOrganization({
    name: teamName,
    orgId,
    accessToken,
  });

  if (updatedOrg.status === "error") {
    throw new Error("Failed to update organization");
  }

  await refreshTokens();
  revalidatePath(`/dashboard/teams/${orgId}/settings`, "layout");
}

export async function deleteTeam(orgId: string) {
  const { getUser, getRoles, refreshTokens } = getKindeServerSession();
  const user = await getUser();
  const roles = await getRoles();
  const accessToken = await getAccessToken();
  if (!user || !accessToken || !roles) {
    throw new Error("Failed to fetch user profile");
  }

  const isOwner = roles.some((role) => role.key === "owner");
  if (!isOwner) {
    throw new Error("User does not have permission to delete organization");
  }

  const deletedOrg = await deleteOrganization({
    orgId,
    accessToken,
  });

  if (deletedOrg.status === "error") {
    throw new Error("Failed to delete organization");
  }

  const { subscription, error: teamError } = await selectSubscription({
    referenceId: orgId,
  });
  if (teamError instanceof Error) {
    console.error("[DB_ERROR]", teamError.message);
    throw new Error("Failed to fetch subscription");
  }
  if (!subscription || !subscription.stripeCustomerId) {
    throw new Error("Failed to fetch subscription");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );
  const subscriptionItemId = stripeSubscription.items.data[0].id;
  await stripe.subscriptionItems.update(subscriptionItemId, {
    quantity: 1,
  });

  const [{ error: subscriptionError }, { error: invitationError }] =
    await Promise.all([
      // Reset the subscription to 1 seat in the database
      updateSubscription(subscription.stripeSubscriptionId, {
        referenceId: user.id,
        seats: 1,
      }),
      // Delete all invitations for the organization
      mightFail(() =>
        db.delete(invitations).where(eq(invitations.orgCode, orgId))
      ),
    ]);
  if (subscriptionError instanceof Error) {
    console.error(subscriptionError.message);
    throw new Error("Failed to update subscription");
  }
  if (invitationError instanceof Error) {
    console.error(invitationError.message);
    throw new Error("Failed to delete invitations for organization");
  }

  await refreshTokens();

  redirect(
    "/api/auth/login?org_code=org_15fd5c1df81&post_login_redirect_url=/dashboard/clients"
  );
}
