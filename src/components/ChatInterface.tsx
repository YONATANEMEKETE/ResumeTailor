'use client';
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import LogoBanner from './LogoBanner';
import Conversation from './Conversation';
import { StripedPattern } from './magicui/striped-pattern';

const ChatInterface = () => {
  const [isMessage, setIsMessage] = useState(false);

  const handleSendMessage = (prompt: {
    message: string;
    resumeurl: string;
  }) => {
    //TODO: here we handle the send logic to interact with the ai
    setIsMessage(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-transparent h-screen flex flex-col relative">
      <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
      {/* Initial State: Centered LogoBanner + Headlines + ChatInput */}
      {!isMessage ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
          <div className="flex flex-col items-center space-y-8 w-full">
            {/* Logo Banner */}
            <LogoBanner />

            {/* Headlines */}
            <div className="text-center space-y-4 max-w-2xl">
              {/* Greeting */}
              <h1 className="text-7xl text-foreground tracking-tight font-lobster">
                Good Morning
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
          <div className="flex-1 overflow-y-auto pt-20 text-center">
            <Conversation />
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="py-6">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
