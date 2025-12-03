'use client';

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import InitialChatView from '@/components/chat/InitialChatView';
import PromptInputWrapper from '@/components/chat/PromptInputWrapper';
import LogoBanner from '@/components/common/LogoBanner';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Fragment, useState } from 'react';
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
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import LoadingResponseIndicator from '@/components/chat/LoadingResponseIndicator';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

const page = () => {
  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat-with-ai',
    }),
  });

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
    <main className="min-h-screen w-screen bg-secondary/50">
      <div className="w-full max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                <Conversation>
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
                                        ? 'w-full'
                                        : ''
                                    }`}
                                  >
                                    {/* TODO: check if the role is assitant, and use another component, that will inline use this messageresponse component for normal text response or another for resume content. */}
                                    {/* <MessageResponse>
                                      {part.text}
                                    </MessageResponse> */}
                                    <MarkdownRenderer markdown={part.text} />
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
                      <LoadingResponseIndicator text="Loading Response" />
                    )}
                  </ConversationContent>
                  <ConversationScrollButton className="z-1000" />
                </Conversation>
              </div>
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="py-6 absolute bottom-0 w-full max-w-4xl z-50">
              <PromptInputWrapper
                onSendMessage={handleSendMessage}
                status={status}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
