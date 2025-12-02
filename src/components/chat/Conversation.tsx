import React from 'react';
import { type UIMessage } from 'ai';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import LoadingResponseIndicator from './LoadingResponseIndicator';

interface Props {
  messages: UIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
  loadingMsg: 'Loading...' | 'Analyzing...' | 'Generating your new resume...';
}

const Conversation = ({ messages, status, loadingMsg }: Props) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen pt-20 p-4 space-y-8 pb-48">
      {messages
        .filter((message) => {
          // Filter out empty user messages (used for sequential API calls)
          if (message.role === 'user') {
            const textContent = message.parts
              .filter((part) => part.type === 'text')
              .map((part) => part.text)
              .join('')
              .trim();
            return textContent.length > 0;
          }
          return true;
        })
        .map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          )
        )}

      {/* Show loading indicator AFTER all messages */}
      {status === 'submitted' && <LoadingResponseIndicator text={loadingMsg} />}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;
