import { getGreeting } from '@/lib/utils';
import LogoBanner from '../common/LogoBanner';
import PromptInputWrapper from './PromptInputWrapper';
import { PromptInputMessage } from '../ai-elements/prompt-input';
import { ChatStatus } from 'ai';

interface InitialChatViewProps {
  onSendMessage: (message: PromptInputMessage, modelId: string) => void;
  status: ChatStatus;
}

const InitialChatView = ({ onSendMessage, status }: InitialChatViewProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
      <div className="flex flex-col items-center space-y-6 md:space-y-8 w-full">
        {/* Logo Banner */}
        <LogoBanner />

        {/* Headlines */}
        <div className="text-center space-y-3 md:space-y-4 max-w-2xl">
          {/* Greeting */}
          <h1
            className="text-4xl md:text-7xl text-foreground tracking-tight font-lobster"
            suppressHydrationWarning
          >
            {getGreeting()}
          </h1>

          {/* Main Headline */}
          <h2 className="text-2xl md:text-4xl font-semibold text-foreground">
            Tailor Your Resume for any Job
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            upload your Resume and paste the job description to get started
          </p>
        </div>

        {/* Chat Input - Centered */}
        <div className="w-full pt-8 md:pt-16">
          <PromptInputWrapper onSendMessage={onSendMessage} status={status} />
        </div>
      </div>
    </div>
  );
};

export default InitialChatView;
