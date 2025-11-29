import { UIMessage } from 'ai';
import MarkdownRenderer from '../common/MarkdownRenderer';

const AssistantMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-full rounded-2xl bg-transparent px-4 py-2 text-sm text-foreground font-medium">
        {message.parts.map((part, index) =>
          part.type === 'text' ? (
            <MarkdownRenderer key={index} markdown={part.text} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;
