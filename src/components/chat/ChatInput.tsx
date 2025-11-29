'use client';
import React, { useState } from 'react';
import FileInput from './FileInput';
import MessageInput from './MessageInput';

interface ChatInputProps {
  onSendMessage?: (message: { message: string; resumeurl: string }) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const handleSend = (message: string) => {
    console.log(message, resumeUrl);
    if (message && onSendMessage) {
      onSendMessage({
        message,
        resumeurl: resumeUrl || '',
      });
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-2xl mx-auto">
        {/* Parent container with border */}
        <div className="flex bg-background rounded-2xl transition-all duration-200 overflow-hidden min-h-32 ring-8 ring-accent shadow-xl">
          {/* Left: File Input Area - 20% width */}
          <div className="w-[20%] max-w-24 flex items-center justify-center border-r border-border">
            <FileInput previewUrl={resumeUrl} setPreviewUrl={setResumeUrl} />
          </div>

          {/* Right: Message Input Area - 80% width */}
          <MessageInput onSend={handleSend} resumeurl={resumeUrl} />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
