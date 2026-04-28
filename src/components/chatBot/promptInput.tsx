'use client';

import type { ChatStatus } from 'ai';
import { ArrowUpIcon, SquareIcon, XIcon } from 'lucide-react';
import type {
  ComponentProps,
  HTMLAttributes,
  KeyboardEventHandler,
} from 'react';
import { useCallback, useState } from 'react';
import {
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { cn } from '@/utils/cn';

export interface PromptInputMessage {
  text: string;
}

export type PromptInputProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  value: string;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
};

export function PromptInput({
  className,
  value,
  onSubmit,
  children,
  ...props
}: PromptInputProps) {
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit({ text: value });
    },
    [value, onSubmit],
  );

  return (
    <form
      className={cn('w-full', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div
        className="flex flex-col rounded-2xl border border-input bg-background overflow-hidden transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20"
        onClick={e => {
          const target = e.target as HTMLElement;
          if (!target.closest('button, input, textarea, a, [role="button"]')) {
            (e.currentTarget as HTMLElement).querySelector('textarea')?.focus();
          }
        }}
      >
        {children}
      </div>
    </form>
  );
}

export type PromptInputTextareaProps = ComponentProps<
  typeof InputGroupTextarea
>;

export function PromptInputTextarea({
  onKeyDown,
  className,
  placeholder = 'Ask a question...',
  ...props
}: PromptInputTextareaProps) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    e => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      if (e.key === 'Enter') {
        if (isComposing || e.nativeEvent.isComposing || e.shiftKey) {
          return;
        }
        e.preventDefault();

        const { form } = e.currentTarget;
        const submitButton = form?.querySelector(
          'button[type="submit"]',
        ) as HTMLButtonElement | null;
        if (submitButton?.disabled) {
          return;
        }

        form?.requestSubmit();
      }
    },
    [onKeyDown, isComposing],
  );

  return (
    <InputGroupTextarea
      className={cn(
        'field-sizing-content max-h-48 min-h-0 resize-none px-4 pt-4 pb-2 text-sm',
        className,
      )}
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
}

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputFooter({
  className,
  ...props
}: PromptInputFooterProps) {
  return (
    <div
      className={cn('flex items-center justify-end px-3 pb-3', className)}
      {...props}
    />
  );
}

export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
  status?: ChatStatus;
  onStop?: () => void;
};

export function PromptInputSubmit({
  className,
  variant = 'default',
  size = 'icon-sm',
  status,
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) {
  const isGenerating = status === 'submitted' || status === 'streaming';

  let Icon = <ArrowUpIcon className="size-4" />;
  let resolvedVariant = variant;

  if (status === 'submitted' || status === 'streaming') {
    Icon = <SquareIcon className="size-4" />;
    resolvedVariant = 'secondary';
  } else if (status === 'error') {
    Icon = <XIcon className="size-4" />;
    resolvedVariant = 'destructive';
  }

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isGenerating && onStop) {
        e.preventDefault();
        onStop();
        return;
      }
      onClick?.(e);
    },
    [isGenerating, onStop, onClick],
  );

  return (
    <InputGroupButton
      aria-label={isGenerating ? 'Stop' : 'Submit'}
      className={cn('rounded-full', className)}
      onClick={handleClick}
      size={size}
      type={isGenerating && onStop ? 'button' : 'submit'}
      variant={resolvedVariant}
      {...props}
    >
      {children ?? Icon}
    </InputGroupButton>
  );
}
