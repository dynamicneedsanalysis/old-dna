"use client";

import { type Dispatch, type SetStateAction } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Textarea } from "@/components/ui/textarea";
import { updateLetter } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/(letters)/actions";

// Takes: A loading boolean, a Client Id, the letter content, the letter type, and a function to set the letter content.
export default function LetterEditor({
  isLoading,
  clientId,
  content,
  type,
  setContent,
}: {
  isLoading: boolean;
  clientId: number;
  content: string;
  type: "cover-letter" | "reasons-why";
  setContent: Dispatch<SetStateAction<string>>;
}) {
  // On adding updating letter content, update database Client with the new content.
  // Use debounced to set a min delay of 500ms (or the browser page re-renders).
  const debouncedUpdateLetter = useDebouncedCallback(
    async (content: string) => {
      await updateLetter({ content: content, type, clientId });
    },
    500
  );

  return (
    <Textarea
      className="text-md mx-auto min-h-[calc(100dvh-200px)] max-w-3xl"
      disabled={isLoading}
      value={content}
      onChange={async (e) => {
        const text = e.target.value;
        setContent(text);
        await debouncedUpdateLetter(text);
      }}
    />
  );
}
