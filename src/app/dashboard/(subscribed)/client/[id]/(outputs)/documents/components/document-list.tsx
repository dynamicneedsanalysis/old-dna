import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectAllDocuments } from "@/db/queries/index";
import { DocumentDropdown } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/documents/components/document-dropdown";

interface DocumentListProps {
  clientId: number;
  userId: string;
}

// Takes: A Client ID and a User ID.
export async function DocumentList({ clientId, userId }: DocumentListProps) {
  // Get all Documents for the Client using their Id.
  const { documents } = await selectAllDocuments(clientId, userId);

  if (!documents) {
    notFound();
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{doc.file.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatFileSize(doc.file.size)}</TableCell>
                <TableCell>
                  {format(new Date(doc.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DocumentDropdown document={doc} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableCell
              className="text-muted-foreground text-center"
              colSpan={4}
            >
              <span>
                You currently have no documents uploaded for this client.
              </span>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
