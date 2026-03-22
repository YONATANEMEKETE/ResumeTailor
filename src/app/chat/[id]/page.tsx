'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import LoadingResponseIndicator from '@/components/chat/LoadingResponseIndicator';
import MarkdownRendererWrapper from '@/components/chat/MarkdownRendererWrapper';
import PromptInputWrapper from '@/components/chat/PromptInputWrapper';
import LogoBanner from '@/components/common/LogoBanner';
import ClassicLoader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';
import { authClient } from '@/lib/auth-client';
import { useConversationStore } from '@/store/conversationStore';
import { usePendingMessageStore } from '@/store/pendingMessageStore';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownIcon, CopyIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { nanoid } from 'nanoid';

const ChatRoomPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId =
    typeof params?.id === 'string' ? params.id : params?.id?.[0];

  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { setCurrentConversation } = useConversationStore();
  const pendingMessage = usePendingMessageStore((s) =>
    conversationId ? s.pendingByConversationId[conversationId] : undefined
  );
  const consumePendingMessage = usePendingMessageStore(
    (s) => s.consumePendingMessage
  );

  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isNewChatFlow, setIsNewChatFlow] = useState(() =>
    Boolean(pendingMessage)
  );
  const [seedUserMessageText, setSeedUserMessageText] = useState<string | null>(
    null
  );
  const lastUserMessageRef = useRef<{
    message: PromptInputMessage;
    modelId: string;
  } | null>(null);

  const extractText = useCallback((m: any): string => {
    if (Array.isArray(m?.parts)) {
      return (
        m.parts
          .filter((p: any) => p?.type === 'text' && typeof p?.text === 'string')
          .map((p: any) => p.text)
          .join('\n') || ''
      );
    }
    if (typeof m?.content === 'string') return m.content;
    if (typeof m?.text === 'string') return m.text;
    return '';
  }, []);

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push('/auth/signin');
    }
  }, [session, isSessionPending, router]);

  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId);
    }
  }, [conversationId, setCurrentConversation]);

  useEffect(() => {
    if (pendingMessage) {
      setIsNewChatFlow(true);
    }
  }, [pendingMessage]);

  const isNewChatFlowActive = isNewChatFlow || Boolean(pendingMessage);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: conversationId || 'unknown-conversation',
    transport: new DefaultChatTransport({
      api: '/api/chat-with-ai',
    }),
    onError: (error) => {
      console.error('Chat error:', error);
      setChatError("We couldn't complete your request.");
    },
    onFinish: ({ message }) => {
      if (!conversationId || message.role !== 'assistant') return;

      let textContent = '';
      if (message.parts) {
        textContent = message.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('\n');
      } else {
        textContent = (message as any).content || '';
      }

      if (textContent) {
        saveMessageToDB(conversationId, 'assistant', textContent);
        queryClient.invalidateQueries({
          queryKey: ['conversation', conversationId],
        });
      }
    },
  });

  useEffect(() => {
    setMessages([]);
    setInitialMessages([]);
    setChatError(null);
  }, [conversationId, setMessages]);

  // If sendMessage() also injects a user message, drop our temporary optimistic one.
  useEffect(() => {
    if (messages.length < 2) return;

    let lastUserIndex = -1;
    let prevUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if ((messages[i] as any)?.role !== 'user') continue;
      if (lastUserIndex === -1) lastUserIndex = i;
      else {
        prevUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1 || prevUserIndex === -1) return;

    const last = messages[lastUserIndex] as any;
    const prev = messages[prevUserIndex] as any;
    const lastText = extractText(last);
    const prevText = extractText(prev);
    if (!lastText || lastText !== prevText) return;

    const lastIsTemp = typeof last.id === 'string' && last.id.startsWith('temp-');
    const prevIsTemp = typeof prev.id === 'string' && prev.id.startsWith('temp-');
    if (!lastIsTemp && !prevIsTemp) return;

    setMessages((current) => {
      if (current.length < 2) return current;
      const tempIndex = lastIsTemp ? lastUserIndex : prevUserIndex;
      return current.filter((_, idx) => idx !== tempIndex);
    });
  }, [messages, extractText, setMessages]);

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (!response.ok) throw new Error('Failed to load conversation');
      return response.json();
    },
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (conversationData?.conversation) {
      const serverMessages = conversationData.conversation.messages;

      // While the assistant is responding, never let the server snapshot override
      // the live client list (new-chat flow depends on this).
      if (status === 'submitted' || status === 'streaming') return;

      // Never replace the client list with a shorter server list (avoids "assistant disappears").
      if (messages.length > 0 && serverMessages.length < messages.length) return;

      const transformedMessages = serverMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        parts: [
          {
            type: 'text',
            text: msg.content,
          },
        ],
      }));

      // In the new-chat redirect flow, wait until the DB has both user+assistant
      // before hydrating, otherwise we'd wipe the streaming assistant message.
      if (isNewChatFlowActive) {
        const lastServerRole = serverMessages.at(-1)?.role;
        if (serverMessages.length < 2 || lastServerRole !== 'assistant') {
          return;
        }
        setIsNewChatFlow(false);
      }

      setInitialMessages(transformedMessages);
    }
  }, [conversationData, messages.length, status, isNewChatFlowActive]);

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  useEffect(() => {
    if (!conversationId || !scrollContainerRef.current) return;
    if (hasAutoScrolledRef.current === conversationId) return;
    if (messages.length === 0 && initialMessages.length === 0) return;

    hasAutoScrolledRef.current = conversationId;
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'auto',
        });
      }
    });
  }, [conversationId, messages.length, initialMessages.length]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const hasAutoScrolledRef = useRef<string | null>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(atBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollToBottomSmooth = () => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const isScrolledToBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100;

        if (isScrolledToBottom || status === 'streaming') {
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: status === 'streaming' ? 'auto' : 'smooth',
              });
            }
          });
        }
      }
    };

    if (status === 'streaming' || messages.length > 0) {
      scrollToBottomSmooth();
    }
  }, [messages, status]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const saveMessageToDB = async (
    convId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          role,
          content,
        }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSendMessage = useCallback(
    async (message: PromptInputMessage, modelId: string) => {
      if (!conversationId) return;

      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);
      if (!(hasText || hasAttachments)) {
        return;
      }

      const messageText = message.text || 'Sent with attachments';
      setChatError(null);
      lastUserMessageRef.current = { message, modelId };

      // Optimistically show the user message immediately (new-chat flow otherwise
      // shows only the assistant while the DB catches up).
      setMessages((prev) => {
        const last = prev.at(-1) as any;
        if (last?.role === 'user' && extractText(last) === messageText) {
          return prev;
        }
        return prev.concat({
          id: `temp-${nanoid()}`,
          role: 'user',
          parts: [
            {
              type: 'text',
              text: messageText,
            },
          ],
        });
      });

      sendMessage(
        {
          text: messageText,
          files: message.files,
        },
        {
          body: {
            model: modelId,
          },
        }
      );

      await saveMessageToDB(conversationId, 'user', messageText);
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
    [conversationId, sendMessage, queryClient, setMessages, extractText]
  );

  useEffect(() => {
    if (!conversationId) return;
    const pending = consumePendingMessage(conversationId);
    if (pending) {
      const pendingText =
        pending.message.text ||
        (pending.message.files?.length ? 'Sent with attachments' : '');
      if (pendingText) {
        setSeedUserMessageText(pendingText);
      }
      handleSendMessage(pending.message, pending.modelId);
    }
  }, [conversationId, consumePendingMessage, handleSendMessage]);

  const shouldInjectSeedUserMessage = useMemo(() => {
    if (!seedUserMessageText) return false;
    const hasUser = messages.some(
      (m: any) => m?.role === 'user' && extractText(m) === seedUserMessageText
    );
    return !hasUser;
  }, [messages, extractText, seedUserMessageText]);

  useEffect(() => {
    if (!seedUserMessageText) return;
    if (!shouldInjectSeedUserMessage) {
      setSeedUserMessageText(null);
    }
  }, [seedUserMessageText, shouldInjectSeedUserMessage]);

  const displayMessages = useMemo(() => {
    if (!shouldInjectSeedUserMessage || !conversationId || !seedUserMessageText) {
      return messages;
    }

    return [
      {
        id: `seed-user-${conversationId}`,
        role: 'user' as const,
        parts: [
          {
            type: 'text' as const,
            text: seedUserMessageText,
          },
        ],
      },
      ...messages,
    ];
  }, [
    shouldInjectSeedUserMessage,
    conversationId,
    seedUserMessageText,
    messages,
  ]);

  const handleRetry = () => {
    if (!lastUserMessageRef.current) return;
    const { message, modelId } = lastUserMessageRef.current;
    handleSendMessage(message, modelId);
  };

  if (isSessionPending) {
    return (
      <div className="min-h-screen w-full bg-secondary/50 flex items-center justify-center">
        <ClassicLoader />
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen w-full bg-secondary/50 relative">
      <div className="fixed top-4 left-4 z-3 md:hidden">
        <SidebarTrigger className="bg-background border border-border shadow-sm cursor-pointer" />
      </div>

      {isLoadingConversation && !isNewChatFlowActive && (
        <div className="absolute inset-0 backdrop-blur-sm bg-background/50 z-9999 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <ClassicLoader />
            <p className="text-sm text-muted-foreground">
              Loading conversation...
            </p>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <AnimatedThemeToggler className="fixed top-4 right-4 z-200" />

        <div className="flex-1 flex flex-col w-full">
          <header className="h-12 absolute z-2 inset-x-0 flex items-center justify-center">
            <LogoBanner />
          </header>
          <div className="flex-1">
            <div className="min-h-screen pt-16 p-3 space-y-6 pb-40">
              <Conversation className="relative">
                <ConversationContent>
                  {displayMessages.map((message) => (
                    <Fragment key={message.id}>
                      {(() => {
                        const parts =
                          Array.isArray((message as any).parts) &&
                          (message as any).parts.length > 0
                            ? (message as any).parts
                            : (() => {
                                const content =
                                  typeof (message as any).content === 'string'
                                    ? (message as any).content
                                    : typeof (message as any).text === 'string'
                                      ? (message as any).text
                                      : '';
                                return content
                                  ? [
                                      {
                                        type: 'text',
                                        text: content,
                                      },
                                    ]
                                  : [];
                              })();

                        return parts.map((part: any, index: number) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <div
                                key={`${message.id}-${index}`}
                                className="space-y-1.5"
                              >
                                <Message
                                  from={message.role}
                                  className="max-w-full"
                                >
                                  <MessageContent
                                    className={`${
                                      message.role === 'assistant'
                                        ? 'w-full max-w-full'
                                        : ''
                                    }`}
                                  >
                                    {message.role === 'user' ? (
                                      <MessageResponse>
                                        {part.text}
                                      </MessageResponse>
                                    ) : (
                                      <MarkdownRendererWrapper
                                        markdown={part.text}
                                        isStreaming={status === 'streaming'}
                                      />
                                    )}
                                  </MessageContent>

                                  <MessageActions
                                    className={`${
                                      message.role === 'user' && 'justify-end'
                                    }`}
                                  >
                                    <MessageAction
                                      onClick={() =>
                                        navigator.clipboard.writeText(part.text)
                                      }
                                      label="Copy"
                                      tooltip="Copy to clipboard"
                                      className="cursor-pointer"
                                    >
                                      <CopyIcon className="size-3" />
                                    </MessageAction>
                                  </MessageActions>
                                </Message>
                                {chatError &&
                                  message.role === 'user' &&
                                  message.id === displayMessages.at(-1)?.id && (
                                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-3 py-2 flex items-start justify-between gap-2">
                                      <div className="text-xs">
                                        <div className="font-medium">
                                          {chatError}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleRetry}
                                          className="cursor-pointer h-7 text-xs"
                                        >
                                          Try again
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setChatError(null)}
                                          className="cursor-pointer h-7 text-xs"
                                        >
                                          Dismiss
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            );
                          case 'reasoning':
                            return (
                                <Reasoning
                                  key={`${message.id}-${index}`}
                                  className="w-full"
                                  isStreaming={
                                    status === 'streaming' &&
                                    index === parts.length - 1 &&
                                    message.id === displayMessages.at(-1)?.id
                                  }
                                >
                                <ReasoningTrigger />
                                <ReasoningContent>
                                  {part.text}
                                </ReasoningContent>
                              </Reasoning>
                            );
                          default:
                            return null;
                        }
                        });
                      })()}
                    </Fragment>
                  ))}
                  {status === 'submitted' && (
                    <LoadingResponseIndicator text="a moment please..." />
                  )}
                </ConversationContent>
                <ConversationScrollButton className="z-1000" />
              </Conversation>
            </div>
          </div>

          {!isAtBottom && status !== 'streaming' && (
            <Button
              onClick={scrollToBottom}
              size="icon"
              variant="outline"
              className="absolute bottom-40 left-1/2 -translate-x-1/2 rounded-full shadow-lg z-50 hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer h-8 w-8"
            >
              <ArrowDownIcon className="size-4" />
            </Button>
          )}

          <div className="py-3 px-3 md:px-0 absolute bottom-0 w-full max-w-xl md:max-w-2xl lg:max-w-3xl z-10">
            <PromptInputWrapper
              onSendMessage={handleSendMessage}
              status={status}
              stop={stop}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatRoomPage;
