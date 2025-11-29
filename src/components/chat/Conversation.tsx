import React from 'react';
import { cn } from '@/lib/utils';
import { type UIMessage } from 'ai';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';

interface Props {
  messages: UIMessage[];
}

const Conversation = ({ messages }: Props) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen pt-20 p-4 space-y-8 pb-48">
      {messages.map((message) =>
        message.role === 'user' ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage key={message.id} message={message} />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;
