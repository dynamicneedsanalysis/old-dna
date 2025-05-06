"use server";

import OpenAI from "openai";
import type { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import type { Message } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Takes: A Client Id and the Open AI thread Id.
// Returns: Up to the last two messages from that thread.
// Message: { id: string, role: string, content: string }
export async function getRecentMessages(
  threadId: string,
  clientId: number,
  updateThreadId: (
    id: number,
    threadId: string
  ) => Promise<{
    error: Error | null;
  }>
): Promise<Message[]> {
  // Find the thread messages in order of most recent.
  const messages = await openai.beta.threads.messages.list(threadId, {
    order: "desc",
  });
  if (!messages.data.length) return [];

  const messageOne = messages.data[0];
  const messageTwo = messages.data[1];

  // If messages do not match the expected role, delete the thread and create a new one.
  if (messageOne.role !== "assistant") {
    const threadDeleted = await openai.beta.threads.del(threadId);
    if (threadDeleted.deleted) {
      const newEmptyThreadId = (await openai.beta.threads.create()).id;
      // Update the Client with the new thread Id.
      await updateThreadId(clientId, newEmptyThreadId);
    }
    return [];
  }

  // Get and return the two most recent messages.
  const recentMessages: Message[] = [
    {
      id: messageTwo.id,
      role: messageTwo.role,
      content: (messageTwo.content[0] as TextContentBlock).text.value,
    },
    {
      id: messageOne.id,
      role: messageOne.role,
      content: (messageOne.content[0] as TextContentBlock).text.value,
    },
  ];
  return recentMessages;
}

// Takes: A Client Id and the Open AI thread Id.
// Returns: A new Open AI thread Id.
export async function createLetterThreadId(): Promise<string> {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread.id;
}
