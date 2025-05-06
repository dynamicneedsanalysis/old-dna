import Link from "next/link";
import { unauthorized } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import DeleteTeamDialog from "./components/delete-team-dialog";
import TeamBasicInfoForm from "./components/team-basic-info-form";

export default async function TeamSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getOrganization, getRoles } = getKindeServerSession();
  const team = await getOrganization();
  const roles = await getRoles();

  if (team?.orgCode !== id || !roles) {
    return unauthorized();
  }
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/teams/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-xl font-bold tracking-tight">{team.orgName}</h2>
        </div>
        <div className="space-y-6 p-4">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <div>
            <TeamBasicInfoForm
              teamName={team.orgName ?? ""}
              teamId={team.orgCode}
            />
          </div>
          <div>
            {roles.some((role) => role.key === "owner") && (
              <>
                <h2 className="mb-4 text-lg font-semibold">Danger Zone</h2>
                <DeleteTeamDialog orgId={team.orgCode} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
