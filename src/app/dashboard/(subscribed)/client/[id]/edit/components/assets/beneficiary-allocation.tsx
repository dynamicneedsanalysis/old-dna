import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

export interface AssetBeneficiaryAllocationWithAlreadyAssigned
  extends Pick<Beneficiary, "id" | "name"> {
  alreadyAssigned: boolean;
  allocation: number;
}

// Takes: An array of Asset Beneficiaries, an onEdit handler, and an onToggle handler.
export function BeneficiaryAllocation({
  assetBeneficiaries,
  onEditBeneficiary,
  onToggleBeneficiary,
}: {
  assetBeneficiaries: AssetBeneficiaryAllocationWithAlreadyAssigned[];
  onEditBeneficiary: (id: number, allocation: number) => void;
  onToggleBeneficiary: (id: number, alreadyAssigned: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficiary Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <BeneficiaryTable
          assetBeneficiaries={assetBeneficiaries}
          onEditBeneficiary={onEditBeneficiary}
          onToggleBeneficiary={onToggleBeneficiary}
        />
      </CardContent>
    </Card>
  );
}

// Takes: An array of Asset Beneficiaries, an onEdit handler, and an onToggle handler.
function BeneficiaryTable({
  assetBeneficiaries,
  onEditBeneficiary,
  onToggleBeneficiary,
}: {
  assetBeneficiaries: AssetBeneficiaryAllocationWithAlreadyAssigned[];
  onEditBeneficiary: (id: number, allocation: number) => void;
  onToggleBeneficiary: (id: number, alreadyAssigned: boolean) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-center">Name</TableHead>
          <TableHead className="text-center">Allocation (Parts)</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assetBeneficiaries.map((beneficiary) => (
          <TableRow key={beneficiary.id}>
            <TableCell
              className={cn("w-[150px] text-center font-medium", {
                "text-muted-foreground": !beneficiary.alreadyAssigned,
              })}
            >
              {beneficiary.name}
            </TableCell>
            <TableCell
              className={cn("text-center", {
                "text-muted-foreground": !beneficiary.alreadyAssigned,
              })}
            >
              <Input
                type="number"
                className="mx-auto w-44"
                value={beneficiary.allocation}
                placeholder="0"
                min={0}
                disabled={!beneficiary.alreadyAssigned}
                onChange={(e) =>
                  onEditBeneficiary(beneficiary.id, +e.target.value)
                }
              />
            </TableCell>
            <TableCell className="text-center">
              <ToggleBeneficiary
                id={beneficiary.id}
                alreadyAssigned={beneficiary.alreadyAssigned}
                onToggleBeneficiary={onToggleBeneficiary}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Takes: An Id, an alreadyAssigned boolean, and an onToggle handler.
function ToggleBeneficiary({
  id,
  alreadyAssigned,
  onToggleBeneficiary,
}: {
  id: number;
  alreadyAssigned: boolean;
  onToggleBeneficiary: (id: number, alreadyAssigned: boolean) => void;
}) {
  return (
    <Switch
      checked={alreadyAssigned}
      onCheckedChange={(checked) => onToggleBeneficiary(id, checked)}
    />
  );
}
