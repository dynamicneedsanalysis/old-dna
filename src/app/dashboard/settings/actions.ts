"use server";

import { createServerAction } from "zsa";
import { Resend } from "resend";
import { getUser } from "@/lib/kinde";
import { ContactSupportEmail } from "@/components/emails/contact-support-form";
import {
  contactFormSchema,
  requestDataInput,
} from "@/app/dashboard/settings/lib/schema";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAccessToken } from "@/lib/kinde";
import { authProcedure } from "@/procedures/auth/actions";
import { deleteAllClients } from "@/db/queries/index";
import { insertAdvisorSchema } from "@/app/dashboard/settings/lib/schema";
import {
  createClientDataRecord,
  createUserDataRecord,
} from "@/db/queries/data-record/data-record";
import {
  createUserDataSummary,
  createClientDataSummary,
} from "@/db/queries/data-summary/data-summary";
import {
  deleteSubscription,
  selectSubscription,
} from "@/db/queries/subscriptions";
import { stripe } from "@/lib/stripe/utils";
import {
  deleteOrganization,
  listOrganizationUserRoles,
} from "@/lib/kinde/organizations";

const resend = new Resend(process.env.RESEND_API_KEY);

// Takes: User Id, access token, properties (Defined in advisor-profile).
// Returns: A JSON string of the User properties response.
async function updateUserProperties(
  userId: string,
  accessToken: string,
  properties: {
    agencyName: string;
    certifications: string;
    streetAddress: string;
    city: string;
    provinceOrState: string;
    postcode: string;
    licensedProvinces: string[];
    insurers: string[];
  }
): Promise<string | void> {
  // Define the input body and authorization headers for the request.
  const inputBody = {
    properties: {
      usr_agency_name: properties.agencyName,
      usr_certifications: properties.certifications,
      kp_usr_street_address: properties.streetAddress,
      kp_usr_city: properties.city,
      kp_usr_state_region: properties.provinceOrState,
      kp_usr_postcode: properties.postcode,
      usr_licensed_provinces: properties.licensedProvinces.toString(),
      usr_insurers: properties.insurers.toString(),
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Fetch the User properties from Kinde API with the User Id.
    const response = await fetch(
      ` ${process.env.KINDE_ISSUER_URL}/api/v1/users/${userId}/properties`,
      {
        method: "PATCH",
        body: JSON.stringify(inputBody),
        headers: headers,
      }
    );

    // On error, log an error and return void.
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData: JSON.stringify(errorData),
      });
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Takes: User Id, access token, full name.
// Returns: A JSON string of the response from updating the User name.
async function updateUserName(
  userId: string,
  accessToken: string,
  fullname: {
    firstName: string;
    lastName: string;
  }
): Promise<string | void> {
  // Define the input body and authorization headers for the request.
  const inputBody = {
    given_name: fullname.firstName,
    family_name: fullname.lastName,
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Fetch the User from Kinde API with the User Id.
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/user?id=${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(inputBody),
        headers: headers,
      }
    );

    // On error, log an error and return void.
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData: JSON.stringify(errorData),
      });
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Uses auth procedure,
// Gets refresh and access tokens from a Kinde session.
// Updates the User's name and properties in the Kinde API.
export const updateUser = authProcedure
  .createServerAction()
  .input(insertAdvisorSchema)
  .handler(async ({ input, ctx }) => {
    // Get access token to update the User.
    const { refreshTokens } = getKindeServerSession();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("No access token found");
    }

    // Call handlers to update the User's name and properties.
    await updateUserName(ctx.user.id, accessToken, {
      firstName: input.firstName,
      lastName: input.lastName,
    });
    await updateUserProperties(ctx.user.id, accessToken, {
      agencyName: input.agencyName,
      certifications: input.certifications,
      streetAddress: input.streetAddress,
      city: input.city,
      provinceOrState: input.provinceOrState,
      postcode: input.postcode,
      licensedProvinces: input.licensedProvinces,
      insurers: input.insurers,
    });

    revalidatePath("/", "layout");
    await refreshTokens();
  });

// Uses auth procedure,
// Gets refresh and access tokens from Kinde session.
// Deletes the User from the Kinde API as well as all their Clients from the database.
// Returns: Stringified JSON of the response or void on error.
export const deleteUser = authProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    // Get access token to delete the User.
    const { getUser, refreshTokens, getUserOrganizations } =
      getKindeServerSession();
    const user = await getUser();
    const orgs = await getUserOrganizations();

    const accessToken = await getAccessToken();
    if (!user || !accessToken || !orgs) {
      throw new Error("Unauthorized");
    }

    // Define the authorization headers for the request using the access token.
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // Cancel the user's Stripe subscription
      const { subscription: userSubscription, error: userError } =
        await selectSubscription({
          referenceId: user.id,
        });
      if (userError instanceof Error) {
        console.error("[DB_ERROR]", userError.message);
        throw new Error("Internal Server Error");
      }
      if (userSubscription && userSubscription.stripeCustomerId) {
        const subscription = await stripe.subscriptions.cancel(
          userSubscription.stripeSubscriptionId
        );
        if (subscription.status !== "canceled") {
          throw new Error("Failed to cancel subscription");
        }

        // Delete the user's subscription from the database.
        const { error: deleteSubscriptionError } = await deleteSubscription(
          userSubscription.referenceId,
          userSubscription.stripeSubscriptionId
        );
        if (deleteSubscriptionError) {
          console.error(
            "Error deleting clients:",
            deleteSubscriptionError.message
          );
          return;
        }
      }

      // Loop through each one and check if the user is an owner.
      for (const orgId of orgs.orgCodes) {
        const isDefaultOrg = orgId === "org_15fd5c1df81";
        if (isDefaultOrg) {
          continue;
        }

        const data = await listOrganizationUserRoles({
          orgId,
          userId: user.id,
        });
        if (data.status === "success") {
          const { roles } = data;

          const isOwner = roles.find((r) => r.key === "owner");

          if (!isOwner) {
            continue;
          }
          // If they are the owner then we want to delete organization
          // and cancel the subscription for the org if there is one.
          await deleteOrganization({ orgId, accessToken });

          // Cancel the user's Stripe subscription
          const { subscription: orgSubscription, error: orgSubError } =
            await selectSubscription({
              referenceId: orgId,
            });
          if (orgSubError instanceof Error) {
            console.error("[DB_ERROR]", orgSubError.message);
            throw new Error("Internal Server Error");
          }
          if (orgSubscription && orgSubscription.stripeCustomerId) {
            const subscription = await stripe.subscriptions.cancel(
              orgSubscription.stripeSubscriptionId
            );
            if (subscription.status !== "canceled") {
              throw new Error("Failed to cancel subscription");
            }

            // Delete the user's subscription from the database.
            const { error: deleteSubscriptionError } = await deleteSubscription(
              orgSubscription.referenceId,
              orgSubscription.stripeSubscriptionId
            );
            if (deleteSubscriptionError) {
              console.error(
                "Error deleting clients:",
                deleteSubscriptionError.message
              );
              return;
            }
          }
        }
      }

      // Delete all the users Clients from the database.
      const { error: deleteAllClientsError } = await deleteAllClients({
        kindeId: ctx.user.id,
      });
      if (deleteAllClientsError) {
        console.error("Error deleting clients:", deleteAllClientsError.message);
        return;
      }

      // Delete the User from the Kinde API using the User Id.
      const response = await fetch(
        `${process.env.KINDE_ISSUER_URL}/api/v1/user?id=${ctx.user.id}&is_delete_profile=true`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      // On error, log an error and return void.
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          errorData: JSON.stringify(errorData),
        });
        return;
      }

      // Clear the cache of layout, refresh the tokens, and return the response JSON.
      revalidatePath("/", "layout");
      await refreshTokens();
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  });

// Takes: Contact form input.
// Creates and sends a support email using form data.
// Returns: CreateEmailResponseSuccess | null based on sending result.
export const contactSupport = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    const { subject, message } = input;

    const user = await getUser();

    // Extract data from the User object for email info.
    const {
      id: userId,
      given_name: firstName,
      family_name: lastName,
      email,
    } = user;

    // Use Resend to send email the formatted Contact Support Form email.
    const { data, error } = await resend.emails.send({
      from: "Dynamic Needs Analysis <no-reply@dynamicneedsanalysis.com>",
      to: ["dynamicneedsanalysis@gmail.com"],
      subject,
      react: ContactSupportEmail({
        userId,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        email: email ?? "",
        message,
      }),
    });

    if (error instanceof Error) {
      // On error, throw error to be displayed to the user.
      console.log(error.message);
      throw new Error("Failed to send email");
    }

    // Return the success data returned from Resend.
    return data;
  });

// Uses authProcedure to get User ID, first name, and last name.
// Takes: Submitted form data.
// Returns: Success message or error message.
// Sends requested data to the User's email address.
export const sendRequestedData = authProcedure
  .createServerAction()
  .input(requestDataInput)
  .handler(async ({ input, ctx }) => {
    try {
      // Define initial subject and body for email.
      let subject = "";
      let body =
        "Attached to this email is the data you requested, in the following files:";

      // Create array to hold summary and record attachments.
      const attachments = [];

      // Handle actions for sending a data summary.
      if (input.sendSummary) {
        // Update the subject and body for the email with data summary information.
        body += "\n - data-summary.txt";
        subject += "Data Summary";

        // Get data summary for the User and their Clients.
        const dataSummary = await getDataSummary(ctx.user.id);

        console.log(dataSummary);

        // Convert data summary to a buffer for attachment.
        const bufferedSummary = Buffer.from(dataSummary);

        // Add data summary attachment to the email.
        attachments.push({
          filename: "data-summary.txt",
          content: bufferedSummary,
        });
      }

      // Handle actions for sending data records.
      if (input.sendRecords) {
        // Update the subject and body for the email with data record information.
        subject += input.sendSummary ? " & Records" : "Data Records";
        body += "\n - data-record.json";

        // Get data records for the User and their Clients.
        const recordData = await getDataRecords(
          ctx.user.id,
          ctx.user.email,
          ctx.user.given_name,
          ctx.user.family_name
        );

        // Convert data records to a buffer for attachment.
        const bufferedData = Buffer.from(JSON.stringify(recordData));

        // Add data record attachment to the email.
        attachments.push({
          filename: "data-record.json",
          content: bufferedData,
        });
      }

      // Send the email with the relevant body content and data request attachments.
      const { error } = await resend.emails.send({
        from: "Dynamic Needs Analysis <no-reply@dynamicneedsanalysis.com>",
        to: input.emailAddress,
        subject: `Data Request - ` + subject,
        text: body,
        attachments: attachments,
      });

      // Catch errors from mailing and return a success message or error message.
      if (error) {
        return new Error("Failed to send data request");
      } else {
        return "Success";
      }
    } catch {
      // Catch any other errors and return a non-specific error message.
      return new Error("Failed to send data request");
    }
  });

// Takes: User ID, first name, and last name.
// Returns: User data and User Client data in a single object.
// Gets the data for the User and their Clients.
async function getDataRecords(
  userId: string,
  email: string | null,
  firstName: string | null,
  lastName: string | null
) {
  try {
    const userRecord = await createUserDataRecord(
      userId,
      email,
      firstName,
      lastName
    );
    const clientsRecord = await createClientDataRecord(userId);

    return { userRecord: userRecord, clientsRecord: clientsRecord };
  } catch (error) {
    // Catch and log any errors, then throw a non-specific error message.
    console.error(error);
    throw new Error("Failed to send data request");
  }
}

// Takes: User Id.
// Returns: A User data summary.
// Checks data associated with the User and returns a summary.
async function getDataSummary(userId: string) {
  try {
    // Create base string for the data summary text file.
    let dataSummary = ``;

    // Get and append the result of the User and Client data summary functions.
    dataSummary += (await createUserDataSummary(userId)).userSummary;
    dataSummary += (await createClientDataSummary(userId)).clientSummary;

    return dataSummary;
  } catch (error) {
    // Catch and log any errors, then throw a non-specific error message.
    console.error(error);
    throw new Error("Failed to send data request");
  }
}
