import { format } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import { FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { selectAllIllustrations } from "@/db/queries/illustrations";
import { IllustrationDropdown } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/components/illustration-dropdown";
import { INSURERS } from "@/constants";

interface IllustrationListProps {
  illustrations: Awaited<
    ReturnType<typeof selectAllIllustrations>
  >["illustrations"];
}

// Takes: A Client ID and a User ID.
export async function IllustrationList({
  illustrations,
}: IllustrationListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {illustrations && illustrations.length > 0 ? (
            illustrations.map((illustration) => {
              const selectedInsurer = INSURERS.find(
                (insurer) => insurer.CompCode === illustration.carrier
              );
              return (
                <TableRow key={illustration.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">
                        {illustration.policyName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {selectedInsurer && (
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedInsurer.Logos.Small || ""}
                          alt={selectedInsurer.Name}
                          width={24}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                        <span className="truncate">{selectedInsurer.Name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatFileSize(illustration.file.size)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(illustration.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <IllustrationDropdown illustration={illustration} />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableCell
              className="text-muted-foreground text-center"
              colSpan={4}
            >
              <span>
                You currently have no illustrations uploaded for this client.
              </span>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
