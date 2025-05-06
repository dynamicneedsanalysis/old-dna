"use client";

import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";
import { useAssistant, type Message } from "ai/react";
import { BotIcon, Loader2Icon, SendIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ChatbotDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center gap-2 transition-all duration-300 print:hidden">
          <SparklesIcon className="size-4" />
          <span className="block font-semibold">Ask AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        variant="ai"
        className="p-0 focus:outline-hidden sm:max-w-[700px]"
      >
        <Chatbox />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Chatbox() {
  // Extract Id form URL params.
  const params = useParams<{ id: string }>();

  // Get status, messages, input, and handlers from useAssistant using the Client Id.
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "/api/assistant", body: { clientId: params.id } });

  // Get the chatbox container reference for scroll control.
  const chatboxContainerRef = useRef<HTMLDivElement>(null);

  // On message change, scroll to the bottom of the chatbox.
  useEffect(() => {
    if (!chatboxContainerRef.current) return;
    chatboxContainerRef.current.scrollTop =
      chatboxContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="pt-4">
      <div
        className="divide-border max-h-[calc(100dvh-300px)] w-full divide-y overflow-y-auto scroll-smooth"
        ref={chatboxContainerRef}
      >
        <AssistantMessage
          message={`I'm an AI assistant trained on a series of books and articles related to life insurance and financial advising. Ask me anything about your insurance needs.`}
        />
        {/* Map over messages with separate UI for user messages and AI responses. */}
        {messages.map(
          (m: Message) =>
            (m.role === "user" && (
              <ChatMessage key={m.id} message={m.content} />
            )) ||
            (m.role === "assistant" && (
              <AssistantMessage key={m.id} message={m.content} />
            ))
        )}
      </div>
      {status === "in_progress" && (
        <div className="flex items-center justify-center gap-2">
          <Loader2Icon className="h-4 w-4 animate-spin" />
        </div>
      )}
      <form onSubmit={submitMessage} className="relative px-8 py-4">
        {/* NOTE: Test update of deprecated `onKeyPress` to `onKeyDown`. */}
        <Textarea
          value={input}
          disabled={status === "in_progress"}
          onChange={handleInputChange}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              await submitMessage();
            }
          }}
          placeholder="Type your message..."
          name="message"
          id="message"
          rows={1}
          className="bg-muted min-h-[48px] resize-none rounded-2xl border border-none border-neutral-400 p-4 pr-16 shadow-xs dark:border-gray-800"
        />
        <Button
          type="submit"
          size="icon"
          disabled={status === "in_progress"}
          className="absolute top-[26px] right-10 h-8 w-8"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}

// Takes: A message string.
function ChatMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start justify-end gap-4 px-8 py-8">
      <div className="prose prose-sm rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p>{message}</p>
      </div>
    </div>
  );
}

// Takes: A string to remove citations from.
export function removeCitations(text: string): string {
  // Remove complete citations
  text = text.replace(/【\d+:\d+†[^】]+】/g, "");

  // Remove partial citations at the end of the string
  text = text.replace(/【\d+:\d+†[^】]*$/, "");

  return text;
}

// Takes: A message string.
function AssistantMessage({ message }: { message: string }) {
  const [cleanedMessage, setCleanedMessage] = useState("");

  // On message update, remove citations from the message before display.
  useEffect(() => {
    setCleanedMessage(removeCitations(message));
  }, [message]);
  return (
    <div className="flex items-start gap-4 px-8 py-8">
      <div className="flex items-start gap-4 text-sm">
        <BotIcon className="hidden h-6 w-6 sm:block" />
        <div className="prose prose-sm rounded-lg">
          <Markdown remarkPlugins={[remarkGfm]}>{cleanedMessage}</Markdown>
        </div>
      </div>
    </div>
  );
}
