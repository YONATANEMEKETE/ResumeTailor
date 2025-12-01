'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/store/useChatStore';
import { useShallow } from 'zustand/shallow';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const { resumeContent, isFirstRequest } = useChatStore(
    useShallow((state) => ({
      resumeContent: state.resumeContent,
      isFirstRequest: state.isFirstRequest,
    }))
  );
  const [message, setMessage] = useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(message);
      setMessage('');
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="flex-1 relative py-2 min-w-0">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Paste your job description here..."
        rows={1}
        className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground font-medium placeholder:text-muted-foreground text-sm px-6 resize-none min-h-10 max-h-[120px] w-full shadow-none overflow-y-auto py-4 whitespace-pre-wrap wrap-break-words"
      />
      <Button
        onClick={() => {
          onSend(message);
          setMessage('');
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
          }
        }}
        disabled={!message.trim() || (!!isFirstRequest && !resumeContent)}
        size="icon"
        className="absolute bottom-2 right-2 shrink-0 w-10 h-10 rounded-xl bg-foreground hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground cursor-pointer"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 text-background" />
      </Button>
    </div>
  );
};

export default MessageInput;
