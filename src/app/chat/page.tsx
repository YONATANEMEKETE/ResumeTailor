'use client';

import { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import InitialChatView from '@/components/chat/InitialChatView';
import LogoBanner from '@/components/common/LogoBanner';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { getGreeting } from '@/lib/utils';
import { useState } from 'react';

const page = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message: PromptInputMessage, modelId: string) => {
    console.log(message, modelId);
  };

  return (
    <main className="min-h-screen w-screen bg-secondary/50">
      <div className="w-full max-w-4xl mx-auto bg-transparent h-screen overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length == 0 && (
          <StripedPattern className="mask-[radial-gradient(300px_circle_at_center,white,transparent)] opacity-50" />
        )}
        {/*  */}
        {messages.length === 0 ? (
          <InitialChatView onSendMessage={handleSendMessage} />
        ) : (
          <div className="flex-1 flex flex-col w-full">
            {/* banner logo */}
            <header className="h-12 absolute inset-x-0 flex items-center justify-center">
              <LogoBanner />
            </header>
            {/* Conversation Component */}
            <div className="flex-1">
              {/* <Conversation
                messages={messages}
                status={status}
                loadingMsg={loadingMsg}
              /> */}
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="py-6 absolute bottom-0 w-full max-w-4xl z-50">
              {/* <ChatInput onSendMessage={handleSendMessage} /> */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default page;
