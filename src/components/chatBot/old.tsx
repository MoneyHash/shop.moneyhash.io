import { useCallback, useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { X, Sparkles } from 'lucide-react';
import { DefaultChatTransport } from 'ai';
import { cn } from '@/utils/cn';
import { MoneyHashLogo } from '@/components/moneyHashLogo';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { searchProducts } from './clientTools/searchProductsAgentTool';

interface ChatProduct {
  id: string;
  name: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
  price: Record<string, number>;
  rating: number;
}

function ChatProductCard({
  product,
  currency,
}: {
  product: ChatProduct;
  currency: string;
}) {
  const price = product.price[currency];
  const stars = Math.round(product.rating);
  return (
    <div className="flex flex-col rounded-xl border border-border/60 bg-muted/30 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer">
      <img
        src={product.imageSrc}
        alt={product.imageAlt}
        className="h-28 w-full object-cover"
      />
      <div className="flex flex-col gap-0.5 p-2 min-w-0">
        <p className="text-xs font-semibold leading-tight truncate">
          {product.name}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {product.color}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] text-amber-500 leading-none">
            {'★'.repeat(stars)}
            {'☆'.repeat(5 - stars)}
          </span>
        </div>
        <span className="text-xs font-bold text-primary mt-0.5">
          {currency} {price}
        </span>
      </div>
    </div>
  );
}

/** MoneyHash mark + sparkle badge — used as the FAB icon */
function MoneyHashChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* MoneyHash mark: scaled to 13 × 13, anchored bottom-left */}
      <g transform="translate(0,4.5) scale(0.40625)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M32 0H0v17.5h11.125l.826-2.76H9l.452-2.04h2.99l1.26-4.3h2.577l-1.26 4.3h3.856l1.26-4.3h2.596l-1.259 4.3H32V0Zm0 14.74H20.98l-.826 2.76H23.2l-.469 2.04h-3.069l-1.18 4.06h-2.597l1.2-4.06H13.25l-1.22 4.06H9.453l1.2-4.06H0V32h32V14.74Zm-17.453 0-.806 2.76h3.836l.807-2.76h-3.837Z"
          clipRule="evenodd"
        />
      </g>
      {/* Primary sparkle — larger 4-pointed star, top-right */}
      <path
        d="M16 0.5 L16.8 3.7 L20 4.5 L16.8 5.3 L16 8.5 L15.2 5.3 L12 4.5 L15.2 3.7 Z"
        fill="currentColor"
      />
      {/* Accent dot */}
      <circle cx="19.5" cy="9.5" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

const SUGGESTED_PROMPTS = [
  'What shirts do you have?',
  'Show me bags under $50',
  'What payment methods do you accept?',
  'Help me with my order',
] as const;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showPulse, setShowPulse] = useState(true);

  const prevMessageCountRef = useRef(0);

  const { messages, sendMessage, status, stop, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/api/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'searchProducts') {
        searchProducts(toolCall.input || {});
        setTimeout(() => {
          addToolOutput({
            tool: 'searchProducts',
            toolCallId: toolCall.toolCallId,
            output: { products: searchProducts(toolCall.input || {}) },
          });
        }, 200);
      }
    },
    // sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  // Pulse ring: re-pulse when new bot message arrives while closed
  useEffect(() => {
    if (!isOpen && messages.length > prevMessageCountRef.current) {
      setShowPulse(true);
      const t = setTimeout(() => setShowPulse(false), 4000);
      prevMessageCountRef.current = messages.length;
      return () => clearTimeout(t);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isOpen]);

  // Stop pulse when opened
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  const handleSubmit = useCallback(
    ({ text }: { text: string }) => {
      if (!text.trim() || status !== 'ready') return;
      sendMessage({ text });
      setInput('');
    },
    [status, sendMessage],
  );

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="chat-widget fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel — always mounted, visibility via CSS transitions */}
      <div
        className={cn(
          'w-96 sm:w-[420px] h-[590px] flex flex-col rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/15 overflow-hidden',
          'transition-all duration-300 ease-in-out origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none',
        )}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Shopping Assistant chat"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-primary via-[hsl(259_93%_34%)] to-[hsl(259_80%_28%)] border-b border-primary/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 shadow-inner">
              <MoneyHashLogo className="h-4 w-4 text-primary-foreground" />
              {/* Online pulse */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-1 ring-[hsl(259_93%_34%)]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary-foreground leading-tight tracking-[-0.01em]">
                Shopping Assistant
              </span>
              <span className="text-[10px] text-primary-foreground/65 leading-tight font-medium tracking-wide uppercase">
                Powered by MoneyHash
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/12 transition-all duration-150"
            aria-label="Close chat"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages area */}
        <Conversation className="flex-1">
          <ConversationContent>
            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-5 mt-8 px-3 animate-in fade-in duration-500">
                {/* Logo with concentric rings */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-20 w-20 rounded-full bg-primary/6 ring-1 ring-primary/10" />
                  <div className="absolute h-14 w-14 rounded-full bg-primary/10 ring-1 ring-primary/15" />
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(259_85%_28%)] shadow-lg shadow-primary/30 ring-2 ring-primary/20">
                    <MoneyHashLogo className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-sm font-semibold text-foreground tracking-[-0.01em]">
                    Hi! How can I help you?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ask me about products, orders, or payment options.
                  </p>
                </div>

                {status === 'ready' && (
                  <div className="w-full space-y-2.5">
                    <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary/70" />
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Try asking
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {SUGGESTED_PROMPTS.map(prompt => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handlePromptClick(prompt)}
                          className={cn(
                            'rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5',
                            'text-xs font-medium text-foreground',
                            'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
                            'transition-all duration-150 cursor-pointer',
                          )}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {messages.map(({ id, role, parts }) => (
              <Message from={role} key={id}>
                {role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/25 shadow-sm">
                      <MoneyHashLogo className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                )}
                <MessageContent>
                  {parts.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <MessageResponse key={`${id}-${i}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }
                    // Handle tool call results (e.g. searchProducts)
                    const toolPart = part as {
                      type: string;
                      state?: string;
                      input?: { currency?: string };
                      output?: { products?: ChatProduct[] };
                    };
                    if (
                      toolPart.type.startsWith('tool-') &&
                      toolPart.state === 'input-available'
                    ) {
                      return 'Loading ...';
                    }
                    if (
                      toolPart.type.startsWith('tool-') &&
                      toolPart.state === 'output-available'
                    ) {
                      const currency = toolPart.input?.currency ?? 'USD';
                      if (!toolPart.output?.products?.length)
                        return 'No products found.';
                      return (
                        <div
                          key={`${id}-${i}`}
                          className="flex gap-2 mt-1 overflow-x-auto pb-1 scrollbar-hide"
                        >
                          {toolPart?.output?.products?.map(product => (
                            <div
                              key={product.id}
                              className="flex-shrink-0 w-44"
                            >
                              <ChatProductCard
                                product={product}
                                currency={currency}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Input area */}
        <div className="px-3 pb-3 pt-2 border-t border-border/60 bg-background flex-shrink-0">
          <div
            className={cn(
              'rounded-2xl border border-input bg-muted/40 overflow-hidden',
              'transition-all duration-200',
              'focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 focus-within:bg-background',
            )}
          >
            <PromptInput
              onSubmit={handleSubmit}
              className="[&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:rounded-none"
            >
              <PromptInputTextarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={status !== 'ready'}
                className="min-h-0 max-h-24 text-sm leading-6"
              />
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit
                  status={status}
                  onStop={stop}
                  disabled={status === 'ready' && !input.trim()}
                  className={cn(
                    'bg-gradient-to-br from-primary to-[hsl(259_85%_28%)] text-primary-foreground',
                    'shadow-md shadow-primary/30',
                    'hover:shadow-lg hover:shadow-primary/40 hover:scale-105',
                    'disabled:opacity-40 disabled:shadow-none disabled:scale-100',
                    'transition-all duration-150',
                  )}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Toggle button with pulse ring */}
      <div className="relative">
        {showPulse && !isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/30 pointer-events-none" />
        )}
        {showPulse && !isOpen && (
          <span className="absolute -inset-1.5 rounded-full animate-ping bg-primary/15 pointer-events-none [animation-delay:150ms]" />
        )}
        <button
          onClick={() => setIsOpen(o => !o)}
          className={cn(
            'relative h-12 w-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-primary via-[hsl(259_93%_34%)] to-[hsl(259_80%_26%)]',
            'text-primary-foreground',
            'shadow-lg shadow-primary/35',
            'hover:shadow-xl hover:shadow-primary/50 hover:scale-105',
            'transition-all duration-200',
          )}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          type="button"
        >
          <span
            className={cn(
              'absolute transition-all duration-200',
              isOpen
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-75',
            )}
          >
            <X className="h-5 w-5" />
          </span>
          <span
            className={cn(
              'absolute transition-all duration-200',
              isOpen
                ? 'opacity-0 -rotate-90 scale-75'
                : 'opacity-100 rotate-0 scale-100',
            )}
          >
            <MoneyHashChatIcon className="h-5 w-5" />
          </span>
        </button>
      </div>
    </div>
  );
}
