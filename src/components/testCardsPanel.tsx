import { useState } from 'react';
import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

export default function TestCardsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { copy } = useCopyToClipboard();
  return (
    <div
      className={clsx(
        'fixed bottom-0 right-5 max-w-xs w-full flex flex-col rounded-md bg-slate-800 text-white text-sm z-10 transition-transform',
        isOpen ? 'translate-y-0' : 'translate-y-[268px]',
      )}
    >
      <button
        type="button"
        className="flex items-center p-4"
        onClick={() => setIsOpen(o => !o)}
      >
        <CreditCardIcon className="w-5 h-5" />
        <p className="uppercase ml-2">test cards</p>
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 ml-auto transition-transform',
            isOpen ? 'rotate-0' : 'rotate-180',
          )}
        />
      </button>
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <button
            type="button"
            className="bg-white text-green-600 rounded-lg flex items-center p-3 font-semibold"
            onClick={async () => {
              setIsOpen(false);
              const isCopied = await copy('1111000000000000');
              if (isCopied)
                toast.success('Copied!', {
                  className: 'text-green-600 font-medium',
                  icon: <CheckIcon className="w-5 h-5" />,
                });
            }}
          >
            <CheckIcon className="w-5 h-5" />
            <span className="ml-1">Success</span>
            <span className="ml-auto tabular-nums">•••• 0000</span>
          </button>

          <button
            type="button"
            className="bg-white text-indigo-600 rounded-lg flex items-center p-3 font-semibold"
            onClick={async () => {
              setIsOpen(false);
              const isCopied = await copy('0000222222222222');
              if (isCopied)
                toast.success('Copied!', {
                  className: 'text-indigo-600 font-medium',
                  icon: <ShieldCheckIcon className="w-5 h-5" />,
                });
            }}
          >
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="ml-1">Authentication</span>
            <span className="ml-auto tabular-nums">•••• 2222</span>
          </button>

          <button
            type="button"
            className="bg-white text-red-600 rounded-lg flex items-center p-3 font-semibold"
            onClick={async () => {
              setIsOpen(false);
              const isCopied = await copy('0000111111111111');
              if (isCopied)
                toast.success('Copied!', {
                  className: 'text-red-600 font-medium',
                  icon: <XMarkIcon className="w-5 h-5" />,
                });
            }}
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="ml-1">Decline</span>
            <span className="ml-auto tabular-nums">•••• 1111</span>
          </button>
        </div>
        <p className="mt-5">
          Click to copy the card number. Use any future expiration date and
          three-number CVC.
        </p>
      </div>
    </div>
  );
}
