import { UIMessage } from 'ai';

const UserMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[80%] rounded-3xl rounded-tr-none bg-primary px-4 py-2 text-sm whitespace-pre-wrap text-primary-foreground">
        {message.parts.map((part, index) =>
          part.type === 'text' ? <span key={index}>{part.text}</span> : null
        )}
      </div>
    </div>
  );
};

export default UserMessage;
