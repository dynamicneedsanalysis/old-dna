"use server";

import {
  selectSubscription,
  updateSubscription,
} from "@/db/queries/subscriptions";
import { getAccessToken } from "@/lib/kinde";
import { stripe } from "@/lib/stripe/utils";
import type { BaseErrorResponse } from "@/lib/kinde/organizations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserInvitationEmail from "@/components/emails/user-invitation";
import { forbidden, redirect } from "next/navigation";
import { Resend } from "resend";
import { db } from "@/db";
import { invitations } from "@/db/schema/invitations";
import { eq } from "drizzle-orm";
import { mightFail } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface DeleteOrganizationUserSuccessResponse {
  status: "success";
  message: string;
}

type DeleteOrganizationUserResponse =
  | DeleteOrganizationUserSuccessResponse
  | BaseErrorResponse;

interface AddSeatsSuccessResponse {
  status: "success";
  message: string;
}

type AddSeatsResponse = AddSeatsSuccessResponse | BaseErrorResponse;

export async function deleteOrganizationUser({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}): Promise<DeleteOrganizationUserResponse> {
  const { refreshTokens } = getKindeServerSession();
  const accessToken = await getAccessToken();
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${orgId}/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        status: "error",
        code: response.status.toString(),
        message: response.statusText,
      };
    }

    const data = await response.json();
    if (data.code === "OK") {
      await refreshTokens();
      const response2 = await fetch(
        `${process.env.KINDE_ISSUER_URL}/api/v1/users/${userId}/refresh_claims`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response2.ok) {
        return {
          status: "error",
          code: response2.status.toString(),
          message: response2.statusText,
        };
      }
      revalidatePath(`/dashboard/teams/${orgId}`);
      return {
        status: "success",
        message: "User deleted from organization",
      };
    }

    return {
      status: "error",
      code: "unknown",
      message: "Unexpected response format",
    };
  } catch (error) {
    // Return error details in Error State API Response format.
    if (error instanceof Error) {
      return {
        status: "error",
        code: "500",
        message: error.message,
      };
    }
    return {
      status: "error",
      code: "500",
      message: "Unknown error",
    };
  }
}

export async function updateTotalSeats(
  seats: number
): Promise<AddSeatsResponse> {
  try {
    // Get the user and return a 401 unauthorized error page if not found.
    const { getUser, getOrganization } = getKindeServerSession();
    const user = await getUser();
    const team = await getOrganization();
    if (!user || !team || !team.orgCode) {
      return {
        status: "error",
        code: "401",
        message: "Unauthorized",
      };
    }

    // Get subscription with the user ID if it's their first time adding seats.
    const { subscription: userSubscription, error: userError } =
      await selectSubscription({
        referenceId: user.id,
      });
    // Get subscription with the team ID since it's not the user's first time adding seats.
    const { subscription: teamSubscription, error: teamError } =
      await selectSubscription({
        referenceId: team.orgCode,
      });
    if (userError instanceof Error) {
      console.error("[DB_ERROR]", userError.message);
      return {
        status: "error",
        code: "500",
        message: "Internal Server Error",
      };
    }
    if (teamError instanceof Error) {
      console.error("[DB_ERROR]", teamError.message);
      return {
        status: "error",
        code: "500",
        message: "Internal Server Error",
      };
    }

    const subscription = userSubscription ?? teamSubscription;

    if (subscription && subscription.stripeCustomerId) {
      if (subscription.seats === seats) {
        throw new Error(`Your seat amount is already ${seats}.`);
      }
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );
      const subscriptionItemId = stripeSubscription.items.data[0].id;
      await stripe.subscriptionItems.update(subscriptionItemId, {
        quantity: seats,
      });

      // Update the subscription with the new seat count in the database.
      await updateSubscription(subscription.stripeSubscriptionId, {
        // Set referenceId to team ID if the user is adding seats for the first time.
        ...(userSubscription && { referenceId: team.orgCode }),
        // Set referenceId back to user ID if the user removes all seats except themselves.
        ...(seats === 1 && { referenceId: user.id }),
        seats,
      });
      revalidatePath(`/dashboard/teams/${team.orgCode}`);
      return {
        status: "success",
        message: "Seats updated successfully",
      };
    }

    return {
      status: "error",
      code: "500",
      message: "Internal Server Error",
    };
  } catch (error) {
    // Return error details in Error State API Response format.
    if (error instanceof Error) {
      return {
        status: "error",
        code: "500",
        message: error.message,
      };
    }
    return {
      status: "error",
      code: "500",
      message: "Unknown error",
    };
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendInvitationEmail({
  id,
  email,
  role,
}: {
  id: number;
  email: string;
  role: string;
}) {
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();
  const org = await getOrganization();

  if (!user) {
    redirect("/api/auth/login");
  }

  if (!org) {
    forbidden();
  }

  const { data, error } = await resend.emails.send({
    from: "Dynamic Needs Analysis <no-reply@dynamicneedsanalysis.com>",
    to: email,
    subject: `Accept your invitation to ${org.orgName}`,
    react: UserInvitationEmail({
      invitationId: id,
      orgName: org.orgName ?? "",
      owner: `${user.given_name} ${user.family_name}`,
      role,
    }),
  });

  if (error instanceof Error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }

  return data;
}

export async function removeInvitation({ id }: { id: number }) {
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();
  const org = await getOrganization();

  if (!user) {
    redirect("/api/auth/login");
  }

  if (!org) {
    forbidden();
  }
  const { error } = await mightFail(() =>
    db.delete(invitations).where(eq(invitations.id, id))
  );

  if (error instanceof Error) {
    console.log(error.message);
    throw new Error("Failed to delete invitation");
  }

  revalidatePath(`/dashboard/teams/${org.orgCode}`);
}
