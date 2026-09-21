import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useTranslation } from 'react-i18next';
import type { Language } from './clientTools/searchProductsAgentTool';

import { FloatingButton } from './floatingButton';
import { ChatBotHeader } from './chatbotHeader';
import { CartView } from './CartView';
import { ChatContainer } from './chatContainer';
import { ChatEmptyMessages } from './chatEmptyMessages';
import { searchProducts } from './clientTools/searchProductsAgentTool';
import { addToCart } from './clientTools/addToCartAgentTool';
import { removeFromCart } from './clientTools/removeFromCartAgentTool';
import { clearCart } from './clientTools/clearCartAgentTool';
import { ProductsList, ProductsListSkeleton } from './clientTools/ProductsList';
import { AddToCartConfirmation } from './clientTools/AddToCartConfirmation';
import { RemoveFromCartConfirmation } from './clientTools/RemoveFromCartConfirmation';
import { ClearCartConfirmation } from './clientTools/ClearCartConfirmation';
import type { ChatUIMessage, Receipt } from './types';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from './promptInput';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from './conversation';
import { Message, MessageContent, MessageResponse } from './message';
import { TypingIndicator } from './typingIndicator';
import { Checkout } from './checkout';
import { CheckoutResultBadge, type CheckoutResult } from './checkout/result';
import { AgenticReceipt } from './AgenticReceipt';
import { AGENT_API_BASE_URL } from './agentApi';
import {
  loadPendingCharges,
  savePendingCharges,
  type PendingCharge,
} from './pendingReceipts';
import useShoppingCart from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';

// How often to poll for a scheduled-charge receipt once one is due.
const POLL_INTERVAL_MS = 4000;
// Stop polling for a charge this long after its due time — guards against a lost
// receipt keeping the poll loop alive indefinitely.
const GIVE_UP_MS = 10 * 60 * 1000; // 10 minutes

export default function ChatBot({ customerId }: { customerId: string }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [view, setView] = useState<'chat' | 'cart'>('chat');
  // Scheduled ("pay later") charges we're still awaiting a receipt for. Seeded
  // from localStorage so a reload keeps polling; polling only runs while this is
  // non-empty (see the effects below).
  const [pendingCharges, setPendingCharges] = useState<PendingCharge[]>(() =>
    typeof window === 'undefined' ? [] : loadPendingCharges(customerId),
  );
  const cart = useShoppingCart(s => s.cart);
  const currency = useCurrency(s => s.currency);
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const language: Language = i18n.language === 'ar' ? 'ar' : 'en';
  const languageRef = useRef(language);
  languageRef.current = language;

  const { messages, sendMessage, status, stop, addToolOutput, setMessages } =
    useChat<ChatUIMessage>({
      transport: new DefaultChatTransport({
        api: `${AGENT_API_BASE_URL}/chat`,
        prepareSendMessagesRequest({ messages }) {
          return {
            body: {
              messages,
              currency: currencyRef.current,
              language: languageRef.current,
            },
          };
        },
      }),
      onToolCall({ toolCall }) {
        if (toolCall.dynamic) return;

        if (toolCall.toolName === 'searchProducts') {
          setTimeout(() => {
            addToolOutput({
              tool: 'searchProducts',
              toolCallId: toolCall.toolCallId,
              output: searchProducts({
                ...toolCall.input,
                currency: toolCall.input.currency || currencyRef.current,
                language: toolCall.input.language ?? languageRef.current,
              }),
            });
          }, 1000);
        } else if (toolCall.toolName === 'findProducts') {
          addToolOutput({
            tool: 'findProducts',
            toolCallId: toolCall.toolCallId,
            output: searchProducts({
              ...toolCall.input,
              currency: toolCall.input.currency || currencyRef.current,
              language: toolCall.input.language ?? languageRef.current,
            }),
          });

          setTimeout(() => {
            sendMessage();
          }, 0);
        } else if (toolCall.toolName === 'getCart') {
          addToolOutput({
            tool: 'getCart',
            toolCallId: toolCall.toolCallId,
            output: cart,
          });

          setTimeout(() => {
            sendMessage();
          }, 0);
        } else if (toolCall.toolName === 'addToCart') {
          addToolOutput({
            tool: 'addToCart',
            toolCallId: toolCall.toolCallId,
            output: addToCart(toolCall.input),
          });

          setTimeout(() => {
            sendMessage();
          }, 0);
        } else if (toolCall.toolName === 'removeFromCart') {
          addToolOutput({
            tool: 'removeFromCart',
            toolCallId: toolCall.toolCallId,
            output: removeFromCart(toolCall.input),
          });

          setTimeout(() => {
            sendMessage();
          }, 0);
        } else if (toolCall.toolName === 'clearCart') {
          addToolOutput({
            tool: 'clearCart',
            toolCallId: toolCall.toolCallId,
            output: clearCart(),
          });

          setTimeout(() => {
            sendMessage();
          }, 0);
        }
      },
    });

  // Reload the pending list when the customer changes, and persist it whenever
  // it changes so a page reload can resume polling.
  useEffect(() => {
    setPendingCharges(loadPendingCharges(customerId));
  }, [customerId]);
  useEffect(() => {
    savePendingCharges(customerId, pendingCharges);
  }, [customerId, pendingCharges]);

  // Register a scheduled charge to await once executeAgenticPayment reports it
  // was deferred. Immediate charges return their receipt inline, so they're not
  // tracked here and never trigger polling.
  useEffect(() => {
    // consentIds whose receipt has already landed (inline SUCCEEDED result or a
    // polled data-receipt). We must skip these: the SCHEDULED tool part lingers
    // in the message history forever, so without this guard, appending a receipt
    // re-fires this effect and re-adds the very charge the poll just resolved —
    // bouncing it back into localStorage and keeping the poll loop alive.
    const resolved = new Set<string>();
    const scheduled: PendingCharge[] = [];
    messages
      .flatMap(message => message.parts)
      .forEach(part => {
        if (part.type === 'data-receipt') {
          resolved.add(part.data.consentId);
        } else if (
          part.type === 'tool-executeAgenticPayment' &&
          part.state === 'output-available'
        ) {
          if (part.output.status === 'SUCCEEDED' && part.output.receipt) {
            resolved.add(part.output.receipt.consentId);
          } else if (part.output.status === 'SCHEDULED') {
            // Anchor the due time to the client clock via the relative delay so
            // it stays consistent with the Date.now() checks in the poll effect.
            const delayMs = Math.max(0, (part.output.delaySeconds ?? 0) * 1000);
            scheduled.push({
              consentId: part.input.consentId,
              dueAt: new Date(Date.now() + delayMs).toISOString(),
            });
          }
        }
      });
    const toAdd = scheduled.filter(s => !resolved.has(s.consentId));
    if (toAdd.length === 0) return;
    setPendingCharges(prev => {
      const seen = new Set(prev.map(p => p.consentId));
      const additions = toAdd.filter(s => !seen.has(s.consentId));
      return additions.length === 0 ? prev : [...prev, ...additions];
    });
  }, [messages]);

  // Poll the backend for scheduled-charge receipts — but ONLY while we're
  // actually waiting on one. The backend executes due charges *on poll*, so we
  // wait until the earliest charge is due before the first request, then poll on
  // an interval and drop each charge as its receipt arrives. When nothing is
  // pending, no requests are made at all. Polling (not SSE) keeps the backend
  // serverless-friendly on Vercel.
  useEffect(() => {
    if (!customerId || pendingCharges.length === 0) return;

    let cancelled = false;

    const appendReceipt = (receipt: Receipt) => {
      const messageId = `receipt-${receipt.id}`;
      setMessages(prev => {
        // De-dupe: a receipt sticks around until the poll that returns it acks
        // it, so overlapping polls can hand back the same one twice.
        if (prev.some(m => m.id === messageId)) return prev;
        return [
          ...prev,
          {
            id: messageId,
            role: 'assistant',
            parts: [{ type: 'data-receipt', id: receipt.id, data: receipt }],
          },
        ];
      });
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `${AGENT_API_BASE_URL}/receipts/poll?customerId=${encodeURIComponent(
            customerId,
          )}`,
        );
        if (!res.ok) return;
        const { receipts } = (await res.json()) as { receipts: Receipt[] };
        if (cancelled) return;
        receipts.forEach(appendReceipt);

        // Stop awaiting charges whose receipt just arrived, and give up on any
        // that are long overdue so a lost receipt can't poll forever.
        const arrived = new Set(receipts.map(r => r.consentId));
        setPendingCharges(prev => {
          const next = prev.filter(
            p =>
              !arrived.has(p.consentId) &&
              Date.now() < Date.parse(p.dueAt) + GIVE_UP_MS,
          );
          return next.length === prev.length ? prev : next;
        });
      } catch {
        // Ignore transient failures; the next tick retries.
      }
    };

    // Hold off until the earliest charge is due (past-due charges start now).
    const earliestDue = Math.min(
      ...pendingCharges.map(p => Date.parse(p.dueAt)),
    );
    const startDelay = Math.max(0, earliestDue - Date.now());

    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      poll();
      interval = setInterval(poll, POLL_INTERVAL_MS);
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, [customerId, pendingCharges, setMessages]);

  const lastMessage = messages[messages.length - 1];
  const hasPendingCheckout =
    lastMessage?.role === 'assistant' &&
    lastMessage.parts.some(
      part =>
        part.type === 'tool-proceedToCheckout' &&
        part.state === 'input-available',
    );

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2 max-sm:inset-0 pointer-events-none">
      <ChatContainer isOpen={isOpen} isExpanded={isExpanded}>
        <ChatBotHeader
          onClose={() => setIsOpen(false)}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(e => !e)}
          onCartClick={() =>
            setView(prevView => (prevView === 'chat' ? 'cart' : 'chat'))
          }
        />

        {view === 'cart' ? (
          <CartView
            onBack={() => setView('chat')}
            onPromptClick={prompt => sendMessage({ text: prompt })}
          />
        ) : (
          <>
            <Conversation>
              <ConversationContent>
                {messages.length === 0 && (
                  <ChatEmptyMessages
                    onPromptClick={prompt => sendMessage({ text: prompt })}
                  />
                )}

                {messages.map(({ id, parts, role }) => (
                  <Message key={id} from={role}>
                    <MessageContent>
                      {parts.map((part, i) => {
                        switch (part.type) {
                          case 'text':
                            return (
                              <MessageResponse isAnimating key={`${id}-${i}`}>
                                {part.text}
                              </MessageResponse>
                            );

                          case 'tool-searchProducts': {
                            if (
                              part.state === 'input-streaming' ||
                              part.state === 'input-available'
                            )
                              return (
                                <ProductsListSkeleton key={`${id}-${i}`} />
                              );

                            if (part.state === 'output-available')
                              return (
                                <ProductsList
                                  key={`${id}-${i}`}
                                  products={part.output}
                                  currency={part.input.currency ?? currency}
                                />
                              );
                            return null;
                          }

                          case 'tool-addToCart': {
                            if (
                              part.state === 'output-available' &&
                              part.output.success
                            )
                              return (
                                <AddToCartConfirmation
                                  key={`${id}-${i}`}
                                  productId={part.output.productId}
                                  quantity={part.output.quantity}
                                  onViewCart={() => setView('cart')}
                                />
                              );
                            return null;
                          }

                          case 'tool-removeFromCart': {
                            if (
                              part.state === 'output-available' &&
                              part.output.success
                            )
                              return (
                                <RemoveFromCartConfirmation
                                  key={`${id}-${i}`}
                                  productId={part.output.productId}
                                  removedQuantity={part.output.removedQuantity}
                                  lineRemoved={part.output.lineRemoved}
                                  onViewCart={() => setView('cart')}
                                />
                              );
                            return null;
                          }

                          case 'tool-clearCart': {
                            if (part.state === 'output-available')
                              return (
                                <ClearCartConfirmation
                                  key={`${id}-${i}`}
                                  removedItems={part.output.removedItems}
                                  removedLines={part.output.removedLines}
                                  alreadyEmpty={part.output.alreadyEmpty}
                                  onViewCart={() => setView('cart')}
                                />
                              );
                            return null;
                          }

                          case 'tool-proceedToCheckout': {
                            if (part.state === 'input-available') {
                              const handleComplete = (
                                output: CheckoutResult,
                              ) => {
                                addToolOutput({
                                  tool: 'proceedToCheckout',
                                  toolCallId: part.toolCallId,
                                  output,
                                });
                                sendMessage();
                              };

                              return (
                                <Checkout
                                  key={`${id}-${i}`}
                                  paymentType={part.input.paymentType}
                                  customerId={customerId}
                                  onComplete={handleComplete}
                                />
                              );
                            }

                            if (part.state === 'output-available') {
                              return (
                                <CheckoutResultBadge
                                  key={`${id}-${i}`}
                                  output={part.output}
                                />
                              );
                            }

                            return null;
                          }

                          case 'tool-executeAgenticPayment': {
                            if (
                              part.state === 'output-available' &&
                              part.output.status === 'SUCCEEDED' &&
                              part.output.receipt
                            )
                              return (
                                <AgenticReceipt
                                  key={`${id}-${i}`}
                                  receipt={part.output.receipt}
                                />
                              );
                            return null;
                          }

                          case 'data-receipt':
                            return (
                              <AgenticReceipt
                                key={`${id}-${i}`}
                                receipt={part.data}
                              />
                            );

                          default:
                            return null;
                        }
                      })}
                    </MessageContent>
                  </Message>
                ))}
                {status === 'submitted' && <TypingIndicator />}
              </ConversationContent>

              <ConversationScrollButton />
            </Conversation>

            <div className="px-4 pb-2">
              <PromptInput
                value={input}
                onSubmit={({ text }) => {
                  if (status === 'ready' && !hasPendingCheckout) {
                    setInput('');
                    sendMessage({ text });
                  }
                }}
              >
                <PromptInputTextarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={
                    hasPendingCheckout
                      ? t('chatBot.input.checkoutInProgress')
                      : t('chatBot.input.placeholder')
                  }
                  disabled={hasPendingCheckout}
                />
                <PromptInputFooter>
                  <PromptInputSubmit
                    status={status}
                    onStop={stop}
                    disabled={
                      hasPendingCheckout ||
                      (!input.trim() && status === 'ready')
                    }
                  />
                </PromptInputFooter>
              </PromptInput>

              <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                {t('chatBot.input.helperText')}
              </p>
            </div>
          </>
        )}
      </ChatContainer>
      <FloatingButton open={isOpen} onClick={() => setIsOpen(o => !o)} />
    </div>
  );
}
