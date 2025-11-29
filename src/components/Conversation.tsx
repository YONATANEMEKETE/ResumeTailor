import React from 'react';
import { cn } from '@/lib/utils';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: Message[];
}

const Conversation = ({ messages }: Props) => {
  return (
    <div className=" min-h-screen pt-20 overflow-y-auto p-4 space-y-8 pb-48">
      {messages.map((message, index) =>
        message.role === 'user' ? (
          <UserMessage key={index} message={message.content} />
        ) : (
          <AssitantMessage key={index} message={message.content} />
        )
      )}
    </div>
  );
};

export default Conversation;

const UserMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-sm whitespace-pre-wrap text-primary-foreground">
        {message}
      </div>
    </div>
  );
};

// TODO: refactor this component into separate file because it will handle many things like markdown rendering and the agentic logic.
const AssitantMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[80%] rounded-2xl bg-secondary px-4 py-2 text-sm whitespace-pre-wrap text-secondary-foreground">
        {message}
      </div>
    </div>
  );
};
