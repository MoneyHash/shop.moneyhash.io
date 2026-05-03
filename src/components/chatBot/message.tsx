import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';
import { memo } from 'react';
import { Streamdown } from 'streamdown';
import { cn } from '@/utils/cn';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      className={cn(
        'group flex w-full max-w-[95%] flex-col gap-1.5',
        'animate-in fade-in slide-in-from-bottom-2 duration-200 fill-mode-both',
        from === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant',
        className,
      )}
      {...props}
    />
  );
}

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export function MessageContent({
  children,
  className,
  ...props
}: MessageContentProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm',
        // User bubble — modern rounded pill shape
        'group-[.is-user]:w-fit group-[.is-user]:ml-auto',
        'group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr',
        'group-[.is-user]:bg-primary group-[.is-user]:px-4 group-[.is-user]:py-2',
        'group-[.is-user]:text-primary-foreground group-[.is-user]:leading-relaxed',
        // Assistant bubble — mirrors user but left-aligned
        'group-[.is-assistant]:w-fit group-[.is-assistant]:max-w-full',
        // Expand to full width when a child opts in (e.g. checkout)
        'group-[.is-assistant]:has-[[data-fill-bubble]]:w-full',
        'group-[.is-assistant]:rounded-2xl group-[.is-assistant]:rounded-tl',
        'group-[.is-assistant]:bg-muted/60 dark:group-[.is-assistant]:bg-muted/30 group-[.is-assistant]:px-4 group-[.is-assistant]:py-2',
        'group-[.is-assistant]:text-foreground group-[.is-assistant]:leading-relaxed',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className,
      )}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    nextProps.isAnimating === prevProps.isAnimating,
);

MessageResponse.displayName = 'MessageResponse';
