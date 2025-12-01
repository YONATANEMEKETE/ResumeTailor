import { generateTheRightPrompts } from '@/lib/prompt';
import { google } from '@ai-sdk/google';
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  smoothStream,
} from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    // messages,
    task,
    resumeContent,
    jd,
  }: {
    messages: UIMessage[];
    resumeContent: string;
    task: 'analyze' | 'generate' | 're-generate' | 'assist';
    jd: string;
  } = await req.json();

  console.log(task);
  console.log(resumeContent);
  console.log(jd);

  const { systemPrompt, userPrompt } = generateTheRightPrompts({
    task,
    resumeContent,
    jobDescription: jd,
  });

  const result = streamText({
    model: google('gemini-2.5-flash'),
    // messages: convertToModelMessages(messages),
    prompt: userPrompt,
    system: systemPrompt,
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}
