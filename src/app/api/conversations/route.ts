import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/conversations - Fetch all conversations for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log('Session:', session ? 'exists' : 'null');
    console.log('Session structure:', JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('Fetching conversations for user:', userId);

    // Test basic query first
    // console.log('Testing basic query...');
    // const testCount = await prisma.conversation.count({
    //   where: { userId },
    // });
    // console.log('User has', testCount, 'total conversations');

    // Simplified query without _count
    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      // Removed _count to test if that's causing the issue
    });

    console.log('Found conversations:', conversations.length);

    // Manually add message count for each conversation
    const conversationsWithCount = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await prisma.message.count({
          where: { conversationId: conv.id },
        });
        return {
          ...conv,
          _count: { messages: messageCount },
        };
      })
    );

    console.log('Added message counts');

    return NextResponse.json({ conversations: conversationsWithCount });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack'
    );
    return NextResponse.json(
      {
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title,
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
