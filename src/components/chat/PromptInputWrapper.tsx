import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputHeader,
} from '@/components/ai-elements/prompt-input';
import { models } from '@/data/models';
import { ChatStatus } from 'ai';
import { Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface PromptInputWrapperProps {
  onSendMessage: (message: PromptInputMessage, modelId: string) => void;
  status: ChatStatus;
}

const PromptInputWrapper = ({
  onSendMessage,
  status,
}: PromptInputWrapperProps) => {
  const [text, setText] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0].id);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    onSendMessage(message, selectedModelId);
    setText('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PromptInput
        onSubmit={handleSubmit}
        className="bg-background ring-8 ring-accent shadow-xl rounded-2xl border-none"
        globalDrop
        maxFiles={1}
        maxFileSize={1024 * 1024 * 5}
        onError={(error) => {
          toast.error(error.message, {
            style: {
              '--normal-bg':
                'color-mix(in oklab, var(--destructive) 10%, var(--background))',
              '--normal-text': 'var(--destructive)',
              '--normal-border': 'var(--destructive)',
            } as React.CSSProperties,
          });
        }}
      >
        <PromptInputHeader>
          <PromptInputAttachments>
            {(attachments) => {
              return <PromptInputAttachment data={attachments} />;
            }}
          </PromptInputAttachments>
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            ref={textAreaRef}
            placeholder="Paste the Job Description"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger
                className="cursor-pointer size-9"
                variant="outline"
              />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments
                  label="Attach your Resume"
                  className="cursor-pointer"
                />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSelect
              onValueChange={(value) => setSelectedModelId(value)}
              value={selectedModelId}
            >
              <PromptInputSelectTrigger className="cursor-pointer focus-visible:border-border  bg-background border border-border">
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {models.map((model) => (
                  <PromptInputSelectItem
                    key={model.id}
                    value={model.id}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    {model.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          {/* TODO:  add status to the disabled and the status attr too from the useChat */}
          <PromptInputSubmit disabled={!text} status={status}>
            <Send className="size-4" />
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default PromptInputWrapper;
