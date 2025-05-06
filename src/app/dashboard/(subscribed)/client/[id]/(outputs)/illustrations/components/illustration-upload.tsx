"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "@/components/ui/label";
import { InsurerSelect } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/components/insurer-select";
import { Input } from "@/components/ui/input";

interface IllustrationUploadProps {
  clientId: number;
}

// Takes: A Client ID.
export function IllustrationUpload({ clientId }: IllustrationUploadProps) {
  const router = useRouter();

  const [selectedInsurer, setSelectedInsurer] = useState<string>("");
  const [policyName, setPolicyName] = useState<string>("");

  const handleSelect = (companyCode: string) => {
    setSelectedInsurer(companyCode);
    // Do something with the selected company code.
  };
  return (
    <div>
      <div className="max-w-lg space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="policyName">Policy Name</Label>
          <Input
            id="policyName"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Select an Insurance Carrier</Label>
          <InsurerSelect onSelect={handleSelect} value={selectedInsurer} />
        </div>
      </div>

      {selectedInsurer && policyName ? (
        <UploadDropzone
          config={{
            mode: "auto",
          }}
          className="ut-button:bg-primary ut-readying:ut-button:bg-primary ut-uploading:cursor-not-allowed ut-uploading:ut-button:after:bg-amber-400 w-full cursor-pointer"
          endpoint="illustrationUploader"
          input={{ clientId, carrier: selectedInsurer, policyName }}
          onClientUploadComplete={() => {
            // On success, show a success toast and refresh the page.
            toast.success("Successfully uploaded file", {
              position: "top-right",
            });
            router.refresh();
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message, { position: "top-right" });
          }}
        />
      ) : null}
    </div>
  );
}
