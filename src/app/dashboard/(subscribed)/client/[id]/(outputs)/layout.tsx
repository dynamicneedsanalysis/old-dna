import React from "react";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/kinde";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { selectSingleClient } from "@/db/queries/index";

// Takes: The children and a promise that resolves to the Client Id.
export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  // Get the Client Id from the URL params and use it to get the User.
  const clientId = parseInt(params.id);
  const user = await getUser();

  // Fetch the Client from the database with the Client and Kinde Ids.
  const { client, error } = await selectSingleClient({
    id: clientId,
    kindeId: user.id,
  });

  if (error) {
    throw error;
  }
  if (!client) {
    return notFound();
  }

  // If the Client has not been onboarded, redirect to the Client edit page.
  if (!client.hasOnboarded) {
    redirect(`/dashboard/client/${clientId}/edit`);
  }

  return (
    <SidebarProvider>
      <AppSidebar clientId={clientId} />
      <MobileHeader />
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
}
