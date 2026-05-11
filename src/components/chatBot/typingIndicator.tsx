import { Message, MessageContent } from './message';

export function TypingIndicator() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-1 py-0.5">
          <span className="size-2 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
          <span className="size-2 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
          <span className="size-2 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
        </div>
      </MessageContent>
    </Message>
  );
}
