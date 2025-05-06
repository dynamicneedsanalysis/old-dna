import { getUser } from "@/lib/kinde";
import { selectAllClients } from "@/db/queries/index";
import { ClientCard } from "@/app/dashboard/(subscribed)/clients/components/client-card";
import { searchParamsCache } from "@/app/dashboard/(subscribed)/clients/lib/searchParams";

export async function ClientList() {
  // Get the current User and use it to select all Clients.
  const user = await getUser();
  const name = searchParamsCache.get("name");
  const { clients, error } = await selectAllClients(user.id, name);

  // If Clients are not found, throw an error.
  if (error) {
    throw error;
  }
  return clients && clients.length > 0 ? (
    <div className="mt-10 grid gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
      {clients.map((c) => (
        <ClientCard key={c.id} client={c} />
      ))}
    </div>
  ) : (
    <div className="mt-10 flex flex-col items-center justify-center text-center">
      <div>
        You currently have no clients. Get started by adding one using the
        button on the top right.
      </div>
    </div>
  );
}
