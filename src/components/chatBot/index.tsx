import { useRef, useState } from 'react';
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
import type { ChatUIMessage } from './types';
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
import { AGENT_API_BASE_URL } from './agentApi';
import useShoppingCart from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';

export default function ChatBot({ customerId }: { customerId: string }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [view, setView] = useState<'chat' | 'cart'>('chat');
  const cart = useShoppingCart(s => s.cart);
  const currency = useCurrency(s => s.currency);
  const currencyRef = useRef(currency);
  currencyRef.current = currency;
  const language: Language = i18n.language === 'ar' ? 'ar' : 'en';
  const languageRef = useRef(language);
  languageRef.current = language;

  const { messages, sendMessage, status, stop, addToolOutput } =
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
                                  onAgentAuthorized={result => {
                                    console.log(
                                      '[chatbot] agent authorization:',
                                      result,
                                    );
                                  }}
                                />
                              );
                            }

                            if (part.state === 'output-available') {
                              return (
                                <CheckoutResultBadge
                                  key={`${id}-${i}`}
                                  customerId={customerId}
                                  output={part.output}
                                  onAgentAuthorized={result => {
                                    console.log(
                                      '[chatbot] agent authorization:',
                                      result,
                                    );
                                  }}
                                />
                              );
                            }

                            return null;
                          }

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
