import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Protects routes by ensuring the user is authenticated before proceeding.
 * If the user is not authenticated, they will be redirected to the specified URL.
 *
 * @async
 * @function
 * @param [redirectUrl="/api/auth/login"] - The URL to redirect unauthenticated users to.
 * @returns Resolves when authentication has been verified and any necessary redirection has been performed.
 */
export default async function protectRoute(redirectUrl = "/api/auth/login") {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(redirectUrl);
  }
}
