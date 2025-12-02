'use client';
import React, { useState } from 'react';
import FileInput from './FileInput';
import MessageInput from './MessageInput';
import { useShallow } from 'zustand/shallow';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage?: (
    message: { message: string },
    isRegenerateMode?: boolean
  ) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const { setResumeContent, setIsFirstRequest, isFirstRequest } = useChatStore(
    useShallow((state) => ({
      isFirstRequest: state.isFirstRequest,
      setIsFirstRequest: state.setIsFirstRequest,
      setResumeContent: state.setResumeContent,
    }))
  );
  const [isRegenerateMode, setIsRegenerateMode] = useState(false);

  const handleSend = (message: string) => {
    if (message && onSendMessage) {
      onSendMessage(
        {
          message,
        },
        isRegenerateMode
      );
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Parent container with border */}
        <div className="flex bg-background rounded-2xl transition-all duration-200 overflow-hidden min-h-32 ring-8 ring-accent shadow-xl relative">
          {/* Left: File Input Area - 20% width */}
          {isFirstRequest && (
            <div className="w-[20%] max-w-24 flex items-center justify-center border-r border-border">
              <FileInput />
            </div>
          )}

          {/* Right: Message Input Area - 80% width */}
          <MessageInput onSend={handleSend} />
          {/* action buttons */}
          {!isFirstRequest && (
            <div className="flex space-x-2 absolute bottom-2 left-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg w-10 h-10 bg-background shadow-sm hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setIsFirstRequest(true);
                      setResumeContent('');
                      window.location.reload();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Chat</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isRegenerateMode ? 'default' : 'outline'}
                    size="icon"
                    className={cn(
                      'rounded-lg w-10 h-10 shadow-sm transition-all duration-300 cursor-pointer',
                      isRegenerateMode
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-background hover:bg-muted'
                    )}
                    onClick={() => setIsRegenerateMode(!isRegenerateMode)}
                  >
                    <RefreshCw
                      className={cn(
                        'h-4 w-4',
                        isRegenerateMode && 'animate-spin-slow'
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Re-generate Mode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
