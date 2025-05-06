"use server";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Gets the User from the Kinde server session.
// Runs session authentication with User and redirects to login if needed.
// Returns: The User object.
export async function getUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }
  return user;
}

// Gets a Kinde access token.
// Returns: A promise with the access token or undefined on error.
export async function getAccessToken(): Promise<string | undefined> {
  try {
    // Make a fetch request to Kinde for the access token using env variables.
    // Values allow calls to the Kinde API with a management Client.
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          audience: `${process.env.KINDE_ISSUER_URL}/api`,
          grant_type: "client_credentials",
          client_id: `${process.env.KINDE_MANAGEMENT_CLIENT_ID}`,
          client_secret: `${process.env.KINDE_MANAGEMENT_CLIENT_SECRET}`,
        }),
      }
    );

    // Log errors before returning the access token.
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
    }

    const { access_token: accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    // On error, log a message and return undefined.
    console.error("Fetch Error: ", error);
    return undefined;
  }
}

type PropertyItem = {
  id: string;
  key: string;
  name: string;
  value: string | null;
  description: string | null;
};
type SuccessState = {
  status: "success";
  properties: {
    agencyName: string;
    certifications: string;
    streetAddress: string;
    city: string;
    provinceOrState: string;
    postcode: string;
    licensedProvinces: string[];
    insurers: string[];
  };
};
type ErrorState = { status: "error"; code: string; message: string };
type ApiResponse = SuccessState | ErrorState;

// Takes: A User Id and an Access Token.
// Calls the Kinde API to get the User's properties.
// Returns: A promise of User's properties as a Success State or an Error State.
export async function getUserProperties(
  userId: string,
  accessToken: string
): Promise<ApiResponse> {
  // Define auth header to make Kinde call.
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Call the Kinde API to get the User's properties.
    // Return an Error State API Response on failure.
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/users/${userId}/properties`,
      {
        method: "GET",
        headers: headers,
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

    // Helper function to find property value
    const findPropertyValue = (key: string): string => {
      const property = data.properties.find(
        (prop: PropertyItem) => prop.key === key
      );
      return property?.value ?? "";
    };

    // Transform the API response to match the desired structure for Success State response.
    const licensedProvinces = findPropertyValue("usr_licensed_provinces");
    const insurers = findPropertyValue("usr_insurers");
    const transformedProperties: SuccessState["properties"] = {
      agencyName: findPropertyValue("usr_agency_name"),
      certifications: findPropertyValue("usr_certifications"),
      streetAddress: findPropertyValue("kp_usr_street_address"),
      city: findPropertyValue("kp_usr_city"),
      provinceOrState: findPropertyValue("kp_usr_state_region"),
      postcode: findPropertyValue("kp_usr_postcode"),
      licensedProvinces: licensedProvinces.length
        ? licensedProvinces.split(",")
        : [],
      insurers: insurers.length ? insurers.split(",") : [],
    };

    // Return the resulting data in Success State API Response format.
    return {
      status: "success",
      properties: transformedProperties,
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

export async function refreshTokens() {
  const { refreshTokens } = getKindeServerSession();
  await refreshTokens();
}
