'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { z } from 'zod';

const feedbackSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message is too long'),
});

export async function submitFeedback(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        error: 'You must be logged in to submit feedback',
      };
    }

    const rawMessage = formData.get('message');
    const validatedFields = feedbackSchema.safeParse({
      message: rawMessage,
    });

    if (!validatedFields.success) {
      return {
        error:
          validatedFields.error.flatten().fieldErrors.message?.[0] ||
          'Invalid input',
      };
    }

    const { message } = validatedFields.data;

    await prisma.feedback.create({
      data: {
        userId: session.user.id,
        message,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      error: 'Something went wrong. Please try again later.',
    };
  }
}
