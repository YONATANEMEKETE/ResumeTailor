'use client';
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import LogoBanner from '../common/LogoBanner';
import Conversation from './Conversation';
import { StripedPattern } from '../magicui/striped-pattern';
import { getGreeting } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const ChatInterface = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSendMessage = async (prompt: {
    message: string;
    resumeurl: string;
  }) => {
    console.log(prompt);
    //TODO: here we handle the send logic to interact with the ai
    sendMessage({ text: prompt.message });
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
            <Conversation messages={messages} />
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
