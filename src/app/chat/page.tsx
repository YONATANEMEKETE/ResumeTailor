'use client';

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import InitialChatView from '@/components/chat/InitialChatView';
import PromptInputWrapper from '@/components/chat/PromptInputWrapper';
import LogoBanner from '@/components/common/LogoBanner';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
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
import { useRouter } from 'next/navigation';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';

const page = () => {
  const router = useRouter();
  const session = authClient.getSession();

  if (!session) {
    return router.push('/auth/signin');
  }
  //
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat-with-ai',
    }),
  });

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

  const handleSendMessage = (message: PromptInputMessage, modelId: string) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          model: modelId,
        },
      }
    );
  };

  return (
    <main className="min-h-screen w-full bg-secondary/50 relative">
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
