"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegenerateLetterDrawerDialog } from "@/components/letters/regenerate-letter-drawer-dialog";
import { generateLetter } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/actions";
import LetterEditor from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/components/editor/letter-editor";

// Takes: A Client Id and a Cover Letter as a string.
export default function CoverLetter({
  coverLetter,
  clientId,
}: {
  coverLetter: string;
  clientId: number;
}) {
  const [content, setContent] = useState(coverLetter);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-4">
      <div className="flex h-full flex-col gap-10">
        <div className="mb-4 flex flex-col items-center justify-center gap-4">
          {content.length === 0 ? (
            <Button
              type="submit"
              disabled={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const { letter } = await generateLetter({
                    clientId,
                    type: "cover-letter",
                  });
                  for await (const v of readStreamableValue(letter)) {
                    setContent((curr) => `${curr}${v}`);
                  }
                } catch (err) {
                  if (err instanceof Error) {
                    console.log(err.message);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Generate Letter
            </Button>
          ) : (
            <RegenerateLetterDrawerDialog
              setContent={setContent}
              clientId={clientId}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              type="cover-letter"
            />
          )}
          {isLoading && <Loader2Icon className="h-6 w-6 animate-spin" />}
          {content.length > 0 && (
            <LetterEditor
              isLoading={isLoading}
              clientId={clientId}
              type="cover-letter"
              content={content}
              setContent={setContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
