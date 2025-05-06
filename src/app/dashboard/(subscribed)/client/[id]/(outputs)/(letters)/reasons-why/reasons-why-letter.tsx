"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegenerateLetterDrawerDialog } from "@/components/letters/regenerate-letter-drawer-dialog";
import { generateLetter } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/actions";
import LetterEditor from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/components/editor/letter-editor";

// Takes: A Client Id and a Reasons Why letter as a string.
export default function ReasonsWhyLetter({
  clientId,
  reasonsWhy,
}: {
  clientId: number;
  reasonsWhy: string;
}) {
  const [content, setContent] = useState(reasonsWhy);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-col gap-10 p-4">
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
                  type: "reasons-why",
                });

                for await (const delta of readStreamableValue(letter)) {
                  setContent(
                    (currentGeneration) => `${currentGeneration}${delta}`
                  );
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
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            clientId={clientId}
            type="reasons-why"
          />
        )}
        {isLoading && <Loader2Icon className="h-6 w-6 animate-spin" />}
        {content.length > 0 && (
          <LetterEditor
            isLoading={isLoading}
            content={content}
            setContent={setContent}
            clientId={clientId}
            type={"reasons-why"}
          />
        )}
      </div>
    </div>
  );
}
