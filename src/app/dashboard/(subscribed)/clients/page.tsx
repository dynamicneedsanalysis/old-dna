import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import protectRoute from "@/lib/auth/protect-route";
import { Loader2Icon } from "lucide-react";
import { DashboardNav } from "@/components/dashboard-nav";
import { ClientDialog } from "@/components/client/client-dialog";
import { ClientList } from "@/app/dashboard/(subscribed)/clients/components/client-list";
import { SearchBar } from "@/app/dashboard/(subscribed)/clients/components/search-bar";
import { searchParamsCache } from "@/app/dashboard/(subscribed)/clients/lib/searchParams";

// Takes: The search params as a record of String to [string | string[] | undefined].
export default async function Dashboard(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  await protectRoute();
  searchParamsCache.parse(searchParams);
  return (
    <NuqsAdapter>
      <div>
        <DashboardNav />
        <section className="mx-auto max-w-7xl px-4 pt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-4xl font-bold">Clients</h1>
            <div className="flex items-center gap-2">
              <SearchBar />
              <ClientDialog mode="add" />
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center gap-2 py-20">
                <Loader2Icon className="h-10 w-10 animate-spin" />
                <span className="text-3xl font-bold">Loading...</span>
              </div>
            }
          >
            <ClientList />
          </Suspense>
        </section>
      </div>
    </NuqsAdapter>
  );
}
