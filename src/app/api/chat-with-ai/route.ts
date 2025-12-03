import { mainSystemPrompt } from '@/data/prompts';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  smoothStream,
} from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: {
    messages: UIMessage[];
    model: string;
  } = await req.json();

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
    system: mainSystemPrompt,
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
