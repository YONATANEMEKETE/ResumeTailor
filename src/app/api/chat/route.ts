import { generateTheRightPrompts } from '@/lib/prompt';
import { google } from '@ai-sdk/google';
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  smoothStream,
} from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    task,
    resumeContent,
    analysis,
  }: {
    messages: UIMessage[];
    resumeContent: string;
    task: 'analyze' | 'generate' | 're-generate' | 'assist';
    analysis?: string;
  } = await req.json();

  console.log(task);
  console.log(resumeContent);
  console.log('Analysis:', analysis);

  const { systemPrompt } = generateTheRightPrompts({
    task,
  });

  // Inject the resume content (and analysis if present) into the system prompt
  // so the model always has this context, even if it's not in the chat history.
  const finalSystemPrompt = `
    ${systemPrompt}

    ### ORIGINAL RESUME CONTENT:
    ${resumeContent}

    ${analysis ? `### ANALYSIS:\n${analysis}` : ''}
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: finalSystemPrompt,
    experimental_transform: smoothStream({
      delayInMs: 10,
      chunking: 'word',
    }),
  });

  return result.toUIMessageStreamResponse();
}
