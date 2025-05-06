import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getUser } from "@/lib/kinde";
import { moneyFormatter } from "@/lib/utils";
import { getDateInUtc } from "@/lib/client/utils";
import { Heading } from "@/components/ui/heading";
import { ClientDialog } from "@/components/client/client-dialog";
import { selectSingleClient } from "@/db/queries/index";

// Takes: A Client Id number.
export async function Client({ clientId }: { clientId: number }) {
  const user = await getUser();

  // Get the Client using the Client and Kinde Ids.
  const { client, error } = await selectSingleClient({
    id: clientId,
    kindeId: user.id,
  });

  if (error) {
    throw error;
  }
  if (!client) {
    notFound();
  }
  return (
    <>
      <div className="flex justify-between gap-2">
        <Heading variant="h1">Client Information</Heading>
        <ClientDialog mode="edit" client={client} />
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold">Name</div>
            <div>{client.name}</div>
          </div>
          <div>
            <div className="font-bold">Birth Date</div>
            <div>{format(getDateInUtc(client.birthDate), "MMMM dd, yyyy")}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold">Annual Income</div>
            <div>{moneyFormatter.format(parseFloat(client.annualIncome))}</div>
          </div>
          <div>
            <div className="font-bold">Province</div>
            <div>{client.province}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold">Sex</div>
            <div>{client.sex === "M" ? "Male" : "Female"}</div>
          </div>
          <div>
            <div className="font-bold">Health Class</div>
            <div>
              {(() => {
                switch (client.health) {
                  case "PP":
                    return "Preferred Plus";
                  case "P":
                    return "Preferred";
                  case "RP":
                    return "Regular Plus";
                  case "R":
                    return "Regular";
                  default:
                    return client.health;
                }
              })()}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold">Smoking Status</div>
            <div>
              {client.smokingStatus ? "Currently a Smoker" : "Non-Smoker"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
