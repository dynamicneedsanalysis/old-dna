import { notFound } from "next/navigation";
import { getUser } from "@/lib/kinde";
import { Separator } from "@/components/ui/separator";
import { selectSingleClient } from "@/db/queries/index";
import { DocumentList } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/components/document-list";
import { DocumentUpload } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/components/document-upload";

interface DocumentsPageProps {
  params: Promise<{ id: number }>;
}

// Takes: A promise that resolves to the Client Id.
export default async function DocumentsPage({ params }: DocumentsPageProps) {
  // Get the User, and the Client Id from the params.
  const { id } = await params;

  const user = await getUser();

  // Select the Client with the given Client Id and the Kinde Id,
  const { client } = await selectSingleClient({
    id,
    kindeId: user.id,
  });
  if (!client) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm">
            Manage documents for {client.name}
          </p>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-6">
        <DocumentUpload clientId={client.id} />
        <DocumentList clientId={client.id} userId={user.id} />
      </div>
    </div>
  );
}
