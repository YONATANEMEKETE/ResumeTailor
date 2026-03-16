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
import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';

const ChatRoomPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId =
    typeof params?.id === 'string' ? params.id : params?.id?.[0];

  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { setCurrentConversation } = useConversationStore();
  const { consumePendingMessage } = usePendingMessageStore();

  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const lastUserMessageRef = useRef<{
    message: PromptInputMessage;
    modelId: string;
  } | null>(null);

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
      if (messages.length > serverMessages.length && messages.length > 0) {
        return;
      }

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
      setInitialMessages(transformedMessages);
    }
  }, [conversationData, messages.length]);

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
    },
    [conversationId, sendMessage]
  );

  useEffect(() => {
    if (!conversationId) return;
    const pending = consumePendingMessage(conversationId);
    if (pending) {
      handleSendMessage(pending.message, pending.modelId);
    }
  }, [conversationId, consumePendingMessage, handleSendMessage]);

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

      {isLoadingConversation && (
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
        className="w-full max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <AnimatedThemeToggler className="fixed top-4 right-4 z-200" />

        <div className="flex-1 flex flex-col w-full">
          <header className="h-12 absolute z-2 inset-x-0 flex items-center justify-center">
            <LogoBanner />
          </header>
          <div className="flex-1">
            <div className="min-h-screen pt-20 p-4 space-y-8 pb-48">
              <Conversation className="relative">
                <ConversationContent>
                  {messages.map((message) => (
                    <Fragment key={message.id}>
                      {message.parts.map((part, index) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <div
                                key={`${message.id}-${index}`}
                                className="space-y-2"
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
                                  message.id === messages.at(-1)?.id && (
                                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3 flex items-start justify-between gap-3">
                                      <div className="text-sm">
                                        <div className="font-medium">
                                          {chatError}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleRetry}
                                          className="cursor-pointer"
                                        >
                                          Try again
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setChatError(null)}
                                          className="cursor-pointer"
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
                                  index === message.parts.length - 1 &&
                                  message.id === messages.at(-1)?.id
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
                      })}
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
              className="absolute bottom-48 left-1/2 -translate-x-1/2 rounded-full shadow-lg z-50 hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
            >
              <ArrowDownIcon className="size-4" />
            </Button>
          )}

          <div className="py-4 md:py-6 px-4 md:px-0 absolute bottom-0 w-full max-w-xl md:max-w-3xl lg:max-w-4xl z-10">
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
