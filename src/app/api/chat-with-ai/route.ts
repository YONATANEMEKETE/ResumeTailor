import { mainSystemPrompt } from '@/data/prompts';
import { models } from '@/data/models';
import { google } from '@ai-sdk/google';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  smoothStream,
} from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
    }: {
      messages: UIMessage[];
      model?: string;
    } = await req.json();

    const allowedModels = new Set(models.map((m) => m.id));
    const resolvedModelId =
      model && allowedModels.has(model) ? model : models[0]?.id;

    if (!resolvedModelId) {
      return NextResponse.json(
        { error: 'No AI model configured' },
        { status: 500 }
      );
    }

    const result = streamText({
      model: google(resolvedModelId),
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
  } catch (error) {
    console.error('chat-with-ai error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
