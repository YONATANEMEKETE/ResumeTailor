'use client';

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import InitialChatView from '@/components/chat/InitialChatView';
import PromptInputWrapper from '@/components/chat/PromptInputWrapper';
import LogoBanner from '@/components/common/LogoBanner';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useRef, useState, useEffect } from 'react';
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
import { CopyIcon, ArrowDownIcon } from 'lucide-react';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import LoadingResponseIndicator from '@/components/chat/LoadingResponseIndicator';
import MarkdownRendererWrapper from '@/components/chat/MarkdownRendererWrapper';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';
import { useConversationStore } from '@/store/conversationStore';
import ClassicLoader from '@/components/ui/loader';

const page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const session = authClient.getSession();

  const { currentConversationId, setCurrentConversation, createConversation } =
    useConversationStore();

  if (!session) {
    return router.push('/auth/signin');
  }

  // State for loading conversation
  // const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const idParam = searchParams.get('id');

  // Track the key for useChat to prevent unnecessary resets during creation
  // If we are on a "new chat", we keep using "new-chat" ID even after URL updates
  // until the user navigates to a *different* conversation.
  const [chatId, setChatId] = useState(() => idParam || 'new-chat');

  // Update chatId only when navigating to a different conversation
  useEffect(() => {
    if (idParam && idParam !== chatId) {
      setChatId(idParam);
    } else if (!idParam && chatId !== 'new-chat') {
      // User navigated to /chat (new chat)
      setChatId('new-chat');
    }
  }, [idParam, chatId]);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: chatId, // Force re-initialization when conversation changes
    transport: new DefaultChatTransport({
      api: '/api/chat-with-ai',
    }),
  });

  // Sync URL ID to global store
  useEffect(() => {
    if (idParam && idParam !== currentConversationId) {
      setCurrentConversation(idParam);
    } else if (!idParam && currentConversationId) {
      setCurrentConversation(null);
    }
  }, [idParam, currentConversationId, setCurrentConversation]);

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isFetching,
  } = useQuery({
    queryKey: ['conversation', idParam],
    queryFn: async () => {
      if (!idParam) return null;
      const response = await fetch(`/api/conversations/${idParam}`);
      if (!response.ok) throw new Error('Failed to load conversation');
      return response.json();
    },
    enabled: !!idParam,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // When conversation data is loaded or changes, update the messages
  useEffect(() => {
    if (conversationData?.conversation) {
      const transformedMessages = conversationData.conversation.messages.map(
        (msg: any) => ({
          id: msg.id,
          role: msg.role,
          parts: [
            {
              type: 'text',
              text: msg.content,
            },
          ],
        })
      );
      setInitialMessages(transformedMessages);
    } else if (!idParam) {
      // Clear messages if no conversation is selected
      setInitialMessages([]);
      setMessages([]);
    }
  }, [conversationData, idParam, setMessages]);

  // Update messages when initialMessages changes (after loading from DB)
  useEffect(() => {
    if (initialMessages.length > 0) {
      console.log('Setting messages from initialMessages:', initialMessages);
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State to track if user is at the bottom
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if user is at the bottom of the scroll container
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // Consider "at bottom" if within 100px of the bottom
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(atBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom while streaming or when new messages arrive
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // Use requestAnimationFrame to throttle scroll updates
    const scrollToBottomSmooth = () => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const isScrolledToBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100;

        // Only scroll if we're already near the bottom or if it's a new message
        if (isScrolledToBottom || status === 'streaming') {
          requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: status === 'streaming' ? 'auto' : 'smooth', // Use instant scroll during streaming
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

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Save message to database
  const saveMessageToDB = async (
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          role,
          content,
        }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Track the last assistant message to save it when complete
  useEffect(() => {
    if (status === 'ready' && messages.length > 0 && currentConversationId) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        // Get the text content from the message parts
        const textContent = lastMessage.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join('\n');

        if (textContent) {
          saveMessageToDB(currentConversationId, 'assistant', textContent);
        }
      }
    }
  }, [status, messages, currentConversationId]);

  const handleSendMessage = async (
    message: PromptInputMessage,
    modelId: string
  ) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) {
      return;
    }

    const messageText = message.text || 'Sent with attachments';

    // Send message to AI IMMEDIATELY for instant UI feedback
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

    // Handle conversation creation and DB saves asynchronously in the background
    // This doesn't block the UI or AI response
    (async () => {
      try {
        let conversationId = currentConversationId;

        // If no current conversation, create one
        if (!conversationId) {
          // Create conversation with title from first message (first 50 chars)
          const title =
            messageText.slice(0, 50) + (messageText.length > 50 ? '...' : '');
          const newConversation = await createConversation(title);

          if (newConversation) {
            conversationId = newConversation.id;

            // Seed the cache with the current messages so React Query doesn't need to fetch immediately
            // This replaces the old ref-based hack
            queryClient.setQueryData(['conversation', newConversation.id], {
              conversation: {
                ...newConversation,
                messages: [
                  {
                    id: 'temp-user-msg', // temporary ID
                    role: 'user',
                    content: messageText,
                  },
                ],
              },
            });

            // Update URL with new conversation ID
            router.push(`/chat?id=${newConversation.id}`);
          }
        }

        // Save user message to DB (non-blocking)
        if (conversationId) {
          await saveMessageToDB(conversationId, 'user', messageText);
        }
      } catch (error) {
        console.error('Error saving message in background:', error);
        // Message is already sent to AI and displayed, so this is non-critical
      }
    })();
  };

  return (
    <main className="min-h-screen w-full bg-secondary/50 relative">
      {/* Loading Overlay */}
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
      {/*  */}
      <div
        ref={scrollContainerRef}
        className="w-full max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* theme toggle */}
        <AnimatedThemeToggler className="fixed top-4 right-4 z-200" />

        {messages.length == 0 && (
          <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
        )}
        {/*  */}
        {messages.length === 0 ? (
          <InitialChatView onSendMessage={handleSendMessage} status={status} />
        ) : (
          <div className="flex-1 flex flex-col w-full">
            {/* banner logo */}
            <header className="h-12 absolute z-100 inset-x-0 flex items-center justify-center">
              <LogoBanner />
            </header>
            {/* Conversation Component */}
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
                                <Message
                                  key={`${message.id}-${index}`}
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
                                    {/* Use MarkdownRendererWrapper for assistant messages to detect and display resume content */}
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

            {/* Scroll to Bottom Button */}
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

            {/* Chat Input - Fixed at bottom */}
            <div className="py-6 absolute bottom-0 w-full max-w-4xl z-10">
              <PromptInputWrapper
                onSendMessage={handleSendMessage}
                status={status}
                stop={stop}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
