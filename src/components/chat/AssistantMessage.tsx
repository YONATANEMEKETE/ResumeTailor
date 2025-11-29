import { UIMessage } from 'ai';

const AssitantMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-full rounded-2xl bg-transparent px-4 py-2 text-sm whitespace-pre-wrap text-forground font-medium">
        {message.parts.map((part, index) =>
          part.type === 'text' ? <span key={index}>{part.text}</span> : null
        )}
      </div>
    </div>
  );
};

export default AssitantMessage;
