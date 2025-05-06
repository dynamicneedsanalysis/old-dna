import { DashboardNav } from "@/components/dashboard-nav";
import { SettingsNav } from "@/app/dashboard/settings/components/settings-nav";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardNav />
      <main className="bg-muted/40 flex min-h-[calc(100dvh-72px-100px)] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsNav />
          {children}
        </div>
      </main>
    </div>
  );
}
