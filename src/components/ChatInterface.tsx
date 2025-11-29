'use client';
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import LogoBanner from './LogoBanner';
import Conversation, { Message } from './Conversation';
import { StripedPattern } from './magicui/striped-pattern';
import { getGreeting } from '@/lib/utils';

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Message[]>([
    { role: 'user', content: 'Hi, I need help tailoring my resume.' },
    {
      role: 'assistant',
      content:
        "Hello! I'd be happy to help. Please upload your current resume and the job description you're targeting.",
    },
    {
      role: 'user',
      content: "I've uploaded it. It's for a Senior Frontend Developer role.",
    },
    {
      role: 'assistant',
      content:
        'Great. I see the resume. Based on the job description, you should emphasize your experience with React and performance optimization. Shall I suggest some bullet points?',
    },
    { role: 'user', content: 'Yes, please.' },
    {
      role: 'assistant',
      content:
        'Here are a few suggestions:\n- Led migration of legacy codebase to Next.js, improving load time by 40%.\n- Implemented a design system using Tailwind CSS, reducing development time for new features.',
    },
    { role: 'user', content: 'Hi, I need help tailoring my resume.' },
    {
      role: 'assistant',
      content:
        "Hello! I'd be happy to help. Please upload your current resume and the job description you're targeting.",
    },
    {
      role: 'user',
      content: "I've uploaded it. It's for a Senior Frontend Developer role.",
    },
    {
      role: 'assistant',
      content:
        'Great. I see the resume. Based on the job description, you should emphasize your experience with React and performance optimization. Shall I suggest some bullet points?',
    },
    { role: 'user', content: 'Yes, please.' },
    {
      role: 'assistant',
      content:
        'Here are a few suggestions:\n- Led migration of legacy codebase to Next.js, improving load time by 40%.\n- Implemented a design system using Tailwind CSS, reducing development time for new features.',
    },
    { role: 'user', content: 'Hi, I need help tailoring my resume.' },
    {
      role: 'assistant',
      content:
        "Hello! I'd be happy to help. Please upload your current resume and the job description you're targeting.",
    },
    {
      role: 'user',
      content: "I've uploaded it. It's for a Senior Frontend Developer role.",
    },
    {
      role: 'assistant',
      content:
        'Great. I see the resume. Based on the job description, you should emphasize your experience with React and performance optimization. Shall I suggest some bullet points?',
    },
    { role: 'user', content: 'Yes, please.' },
    {
      role: 'assistant',
      content:
        'Here are a few suggestions:\n- Led migration of legacy codebase to Next.js, improving load time by 40%.\n- Implemented a design system using Tailwind CSS, reducing development time for new features.',
    },
  ]);

  const handleSendMessage = (prompt: {
    message: string;
    resumeurl: string;
  }) => {
    //TODO: here we handle the send logic to interact with the ai
    setConversations((prev) => [
      ...prev,
      { role: 'user', content: prompt.message },
    ]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {conversations.length == 0 && (
        <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
      )}
      {/* Initial State: Centered LogoBanner + Headlines + ChatInput */}
      {conversations.length === 0 ? (
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
            <Conversation messages={conversations} />
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
