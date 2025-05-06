import { checkSubscription } from "@/lib/stripe/utils";
import { redirect } from "next/navigation";

export default async function SubscribedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the User is subscribed and redirect to billing if not.
  const isSubscribed = await checkSubscription();

  if (!isSubscribed) {
    redirect("/dashboard/settings");
  }

  return children;
}
