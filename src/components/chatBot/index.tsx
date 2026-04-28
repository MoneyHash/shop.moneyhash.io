import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { FloatingButton } from './floatingButton';
import { ChatBotHeader } from './chatbotHeader';
import { ChatContainer } from './chatContainer';
import { ChatEmptyMessages } from './chatEmptyMessages';
import { searchProducts } from './clientTools/searchProductsAgentTool';
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

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/api/chat',
    }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'searchProducts') {
        searchProducts(toolCall.input || {});
        console.log(toolCall.input);
        setTimeout(() => {
          addToolOutput({
            tool: 'searchProducts',
            toolCallId: toolCall.toolCallId,
            output: { products: searchProducts(toolCall.input || {}) },
          });
        }, 200);
      }
    },
  });

  console.log(messages);

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2 max-sm:inset-0 pointer-events-none">
      <ChatContainer isOpen={isOpen} isExpanded={isExpanded}>
        <ChatBotHeader
          onClose={() => setIsOpen(false)}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(e => !e)}
        />

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

                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <div className="px-4 pb-2">
          <PromptInput
            value={input}
            onSubmit={({ text }) => {
              if (status === 'ready') {
                setInput('');
                sendMessage({ text });
              }
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search or ask a question..."
              // disabled={}
            />
            <PromptInputFooter>
              <PromptInputSubmit
                status={status}
                onStop={stop}
                disabled={!input.trim() && status === 'ready'}
              />
            </PromptInputFooter>
          </PromptInput>

          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </ChatContainer>
      <FloatingButton open={isOpen} onClick={() => setIsOpen(o => !o)} />
    </div>
  );
}
