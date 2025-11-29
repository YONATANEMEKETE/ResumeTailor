import { google } from '@ai-sdk/google';
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  smoothStream,
} from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: 'You are a helpful assistant.',
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}
