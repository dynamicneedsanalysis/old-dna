import { AssistantResponse } from "ai";
import OpenAI from "openai";
import type { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs.mjs";
import { getUser } from "@/lib/kinde";
import { z } from "zod";
import { getClientInformation } from "@/app/api/actions/client-info";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const inputSchema = z.object({
  threadId: z.string().nullable(),
  message: z.string(),
  clientId: z.coerce.number(),
});

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

export async function POST(req: Request): Promise<Response> {
  // Parse the request body.
  const input = inputSchema.parse(await req.json());
  const user = await getUser();

  // Create a thread if needed.
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread.
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Run the assistant on the thread to get a response.
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      let runResult = await forwardStream(runStream);

      // Status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === "requires_action" &&
        runResult.required_action?.type === "submit_tool_outputs"
      ) {
        // When the status requires an action for tool outputs:
        // Check if the required action is for getting Client information.
        // If so, call the function and submit the tool outputs. Otherwise, throw an error.
        const tool_outputs = await Promise.all(
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            async (toolCall: RequiredActionFunctionToolCall) => {
              // const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                // Configure your tool calls here.
                case "get_client_information":
                  return {
                    tool_call_id: toolCall.id,
                    output: await getClientInformation(input.clientId, user.id),
                  };
                default:
                  throw new Error(
                    `Unknown tool call function: ${toolCall.function.name}`
                  );
              }
            }
          )
        );

        // After submitting the Client information, get the next run result.
        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs }
          )
        );
      }
    }
  );
}
