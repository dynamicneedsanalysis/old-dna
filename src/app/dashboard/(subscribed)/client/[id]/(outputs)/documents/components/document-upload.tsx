"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";

interface DocumentUploadProps {
  clientId: number;
}

// Takes: A Client ID.
export function DocumentUpload({ clientId }: DocumentUploadProps) {
  const router = useRouter();
  return (
    <UploadDropzone
      config={{
        mode: "auto",
      }}
      className="ut-button:bg-primary ut-readying:ut-button:bg-primary ut-uploading:cursor-not-allowed ut-uploading:ut-button:after:bg-amber-400 w-full cursor-pointer"
      endpoint="documentUploader"
      input={{ clientId }}
      onClientUploadComplete={() => {
        toast.success("Successfully uploaded file", { position: "top-right" });
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message, { position: "top-right" });
      }}
    />
  );
}
