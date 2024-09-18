import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';

import { cn } from '@/utils/cn';
import useCurrency from '@/store/useCurrency';
import { testCards } from '@/utils/testCards';

export default function TestCardsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [cantTransition, setCanTransition] = useState(false);
  const currency = useCurrency(state => state.currency);
  const cards = testCards[currency];

  const { copy } = useCopyToClipboard();

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    setCanTransition(true);
  }, [contentHeight]);

  return (
    <div
      className={cn(
        'fixed bottom-0 right-5 flex flex-col rounded-t-md max-w-xs bg-background shadow-lg text-sm z-20 border',
        cantTransition && 'transition-transform',
      )}
      style={{
        transform: isOpen ? 'translateY(0)' : `translateY(${contentHeight}px)`,
      }}
    >
      <button
        type="button"
        className="flex items-center p-4"
        onClick={() => setIsOpen(o => !o)}
      >
        <CreditCardIcon className="w-5 h-5" />
        <p className="uppercase ml-2">Test Cards</p>
        <ChevronDownIcon
          className={cn(
            'w-5 h-5 ml-auto transition-transform',
            isOpen ? 'rotate-0' : 'rotate-180',
          )}
        />
      </button>
      <div ref={contentRef} className="px-4 pb-4">
        {/* <div>
          <h3 className="text-base mb-1">Configurations</h3>
          <JsonEditor value={jsonConfig} onChange={setJsonConfig} />
          <div className="mt-2 flex gap-1">
            <p>Want to save configuration?</p>
            <button
              type="button"
              className="select-none cursor-pointer underline hover:text-blue-500"
              onClick={saveConfig}
            >
              click here.
            </button>
          </div>
        </div> */}

        <a
          href={cards.docsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {cards.providerName} - Test Cards Docs
        </a>
        <div className="flex flex-col space-y-3 mt-3">
          <button
            type="button"
            className="bg-muted/50 text-green-500 rounded-lg flex items-center p-3 font-medium"
            onClick={async () => {
              setIsOpen(false);
              const isCopied = await copy(cards.frictionless);
              if (isCopied)
                toast.success('Copied!', {
                  className: '!text-green-500 !bg-background',
                  icon: <CheckIcon className="w-5 h-5" />,
                });
            }}
          >
            <CheckIcon className="w-5 h-5" />
            <span className="ml-1">Success</span>
            <span className="ml-auto tabular-nums">
              •••• {cards.frictionless.slice(-4)}
            </span>
          </button>

          <button
            type="button"
            className="bg-muted/50 text-indigo-500 rounded-lg flex items-center p-3 font-medium"
            onClick={async () => {
              setIsOpen(false);
              const isCopied = await copy(cards.challenge);
              if (isCopied)
                toast.success('Copied!', {
                  className: '!text-indigo-500 !bg-background font-medium',
                  icon: <ShieldCheckIcon className="w-5 h-5" />,
                });
            }}
          >
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="ml-1">Authentication</span>
            <span className="ml-auto tabular-nums">
              •••• {cards.challenge.slice(-4)}
            </span>
          </button>

          {cards.failed && (
            <button
              type="button"
              className="bg-muted/50 text-red-500 rounded-lg flex items-center p-3 font-medium"
              onClick={async () => {
                setIsOpen(false);
                const isCopied = await copy(cards.failed!);
                if (isCopied)
                  toast.success('Copied!', {
                    className: '!text-red-500 !bg-background font-medium',
                    icon: <XMarkIcon className="w-5 h-5" />,
                  });
              }}
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="ml-1">Decline</span>
              <span className="ml-auto tabular-nums">
                •••• {cards.failed.slice(-4)}
              </span>
            </button>
          )}
        </div>
        <p className="mt-5 text-xs">
          Click to copy the card number.{' '}
          {cards.customExpirationMessage ||
            `Use any future expiration date and
          three-number CVV.`}
        </p>
      </div>
    </div>
  );
}
