import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAccessToken } from ".";

export interface BaseErrorResponse {
  status: "error";
  code: string;
  message: string;
}

interface GetOrganizationSuccessResponse {
  status: "success";
  org: {
    id: string;
    name: string;
    handle: string;
    sender_email: string;
  };
}

type GetOrganizationResponse =
  | GetOrganizationSuccessResponse
  | BaseErrorResponse;

interface CreateOrganizationSuccessResponse {
  status: "success";
  orgId: string;
}

type CreateOrganizationResponse =
  | CreateOrganizationSuccessResponse
  | BaseErrorResponse;

interface UpdateOrganizationSuccessResponse {
  status: "success";
  message: string;
}

type UpdateOrganizationResponse =
  | UpdateOrganizationSuccessResponse
  | BaseErrorResponse;

interface DeleteOrganizationSuccessResponse {
  status: "success";
  message: string;
}

type DeleteOrganizationResponse =
  | DeleteOrganizationSuccessResponse
  | BaseErrorResponse;

interface GetOrganizationUsersSuccessResponse {
  status: "success";
  orgUsers: {
    id: string;
    email: string;
    full_name: string;
    last_name: string;
    first_name: string;
    picture: string;
    joined_on: string;
    roles: string[];
  }[];
}

type GetOrganizationUsersResponse =
  | GetOrganizationUsersSuccessResponse
  | BaseErrorResponse;

interface OrganizationUser {
  id: string;
  roles: string[];
}

interface AddOrganizationUsersSuccessResponse {
  status: "success";
  usersAdded: number;
}

type AddOrganizationUsersResponse =
  | AddOrganizationUsersSuccessResponse
  | BaseErrorResponse;

interface ListOrganizationUserRolesSuccessResponse {
  status: "success";
  roles: { id: string; key: string; name: string }[];
}

type ListOrganizationUserRolesResponse =
  | ListOrganizationUserRolesSuccessResponse
  | BaseErrorResponse;

export async function getOrganization({
  orgId,
  accessToken,
}: {
  orgId: string;
  accessToken: string;
}): Promise<GetOrganizationResponse> {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organization?code=${orgId}`,
      {
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
    if (data.message === "Success") {
      return {
        status: "success",
        org: {
          id: data.code,
          name: data.name,
          handle: data.handle,
          sender_email: data.sender_email,
        },
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

export async function createOrganization({
  name,
  email,
  accessToken,
}: {
  name: string;
  email: string;
  accessToken: string;
}): Promise<CreateOrganizationResponse> {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organization`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          sender_email: email,
        }),
      }
    );
    const data = await response.json();
    console.dir({ res: data.errors });
    if (!response.ok) {
      return {
        status: "error",
        code: response.status.toString(),
        message: response.statusText,
      };
    }

    if (data.message === "Success") {
      return {
        status: "success",
        orgId: data.organization.code,
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

export async function updateOrganization({
  name,
  orgId,
  accessToken,
}: {
  name: string;
  orgId: string;
  accessToken: string;
}): Promise<UpdateOrganizationResponse> {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organization/${orgId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          name,
        }),
      }
    );
    const data = await response.json();
    console.log({ data });

    if (!response.ok) {
      return {
        status: "error",
        code: response.status.toString(),
        message: response.statusText,
      };
    }

    if (data.code === "ORGANIZATION_UPDATED") {
      return {
        status: "success",
        message: "Organization successfully updated",
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

export async function deleteOrganization({
  orgId,
  accessToken,
}: {
  orgId: string;
  accessToken: string;
}): Promise<DeleteOrganizationResponse> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organization/${orgId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      return {
        status: "error",
        code: response.status.toString(),
        message: response.statusText,
      };
    }

    return {
      status: "success",
      message: "Organization successfully deleted",
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

export async function getOrganizationUsers({
  orgId,
}: {
  orgId: string;
}): Promise<GetOrganizationUsersResponse> {
  const accessToken = await getAccessToken();
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${orgId}/users`,
      {
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
    if (data.message === "Success") {
      return {
        status: "success",
        orgUsers: data.organization_users,
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

export async function addOrganizationUsers({
  orgId,
  users,
}: {
  orgId: string;
  users: OrganizationUser[];
}): Promise<AddOrganizationUsersResponse> {
  const { refreshTokens } = getKindeServerSession();
  const accessToken = await getAccessToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${orgId}/users`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          users,
        }),
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

      return {
        status: "success",
        usersAdded: data.users_added,
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

export async function listOrganizationUserRoles({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}): Promise<ListOrganizationUserRolesResponse> {
  const { refreshTokens } = getKindeServerSession();
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${orgId}/users/${userId}/roles`,
      {
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

      return {
        status: "success",
        roles: data.roles,
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
