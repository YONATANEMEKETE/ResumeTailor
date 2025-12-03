'use client';
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import LogoBanner from '../common/LogoBanner';
import Conversation from './Conversation';
import { StripedPattern } from '../magicui/striped-pattern';
import { getGreeting } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useChatStore } from '@/store/useChatStore';
import { useShallow } from 'zustand/shallow';

const ChatInterface = () => {
  const { isFirstRequest, resumeContent, setIsFirstRequest } = useChatStore(
    useShallow((state) => ({
      isFirstRequest: state.isFirstRequest,
      resumeContent: state.resumeContent,
      setIsFirstRequest: state.setIsFirstRequest,
    }))
  );
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [loadingMsg, setLoadingMsg] = useState<
    'Loading...' | 'Analyzing...' | 'Generating your new resume...'
  >('Loading...');

  // Update loading message based on status and message count
  React.useEffect(() => {
    if (status === 'submitted' || status === 'streaming') {
      if (isFirstRequest) {
        // Count assistant messages to determine which phase we're in
        const assistantMessageCount = messages.filter(
          (msg) => msg.role === 'assistant'
        ).length;

        if (assistantMessageCount === 0) {
          setLoadingMsg('Analyzing...');
        } else if (assistantMessageCount === 1) {
          setLoadingMsg('Generating your new resume...');
        }
      } else {
        setLoadingMsg('Loading...');
      }
    }
  }, [status, messages, isFirstRequest]);

  const handleSendMessage = async (
    prompt: { message: string },
    isRegenerateMode?: boolean
  ) => {
    console.log(prompt);
    if (isFirstRequest) {
      // First request: analyze the job description
      const analyzeResponse = await sendMessage(
        { text: prompt.message },
        {
          body: {
            resumeContent,
            task: 'analyze',
            promptMessage: prompt.message,
          },
        }
      );

      // Wait for the analysis to complete and extract it
      // The analysis will be in the last assistant message
      const analysisMessage = messages.find(
        (msg) =>
          msg.role === 'assistant' &&
          msg.parts.some((part) => part.type === 'text')
      );

      const analysisText =
        analysisMessage?.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join('') || '';

      // Second request: generate the tailored resume with the analysis
      await sendMessage(
        { text: '' },
        {
          body: {
            resumeContent,
            task: 'generate',
            analysis: analysisText,
          },
        }
      );

      // Mark first request as complete
      setIsFirstRequest(false);
    } else {
      if (isRegenerateMode) {
        // todo make the re-generate request
        await sendMessage(
          { text: prompt.message },
          {
            body: {
              task: 're-generate',
            },
          }
        );
      } else {
        // todo make the normal request
        await sendMessage(
          { text: prompt.message },
          {
            body: {
              task: 'assist',
            },
          }
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {messages.length == 0 && (
        <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
      )}
      {/* Initial State: Centered LogoBanner + Headlines + ChatInput */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
          <div className="flex flex-col items-center space-y-8 w-full">
            {/* Logo Banner */}
            <LogoBanner />

            {/* Headlines */}
            <div className="text-center space-y-4 max-w-2xl">
              {/* Greeting */}
              <h1
                className="text-7xl text-foreground tracking-tight font-lobster"
                suppressHydrationWarning
              >
                {getGreeting()}
              </h1>

              {/* Main Headline */}
              <h2 className="text-4xl font-semibold text-foreground">
                Tailor Your Resume for any Job
              </h2>

              {/* Subtitle */}
              <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                upload your Resume and paste the job description to get started
              </p>
            </div>

            {/* Chat Input - Centered */}
            <div className="w-full pt-16">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      ) : (
        /* Conversation State: Show Conversation component */
        <div className="flex-1 flex flex-col w-full">
          {/* banner logo */}
          <header className="h-12 absolute inset-x-0 flex items-center justify-center">
            <LogoBanner />
          </header>
          {/* Conversation Component */}
          <div className="flex-1">
            <Conversation
              messages={messages}
              status={status}
              loadingMsg={loadingMsg}
            />
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="py-6 absolute bottom-0 w-full max-w-4xl z-50">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
