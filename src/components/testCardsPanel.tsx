import { useCallback, useState } from 'react';
import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import useJsonConfig from '../store/useJsonConfig';
import JsonEditor from './JsonEditor';
import safeLocalStorage from '../utils/safeLocalStorage';

function isJsonValid(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default function TestCardsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { copy } = useCopyToClipboard();
  const { jsonConfig, setJsonConfig } = useJsonConfig();

  const saveConfig = useCallback(() => {
    if (!jsonConfig) {
      toast.error('No configuration to save.');
      return;
    }
    if (isJsonValid(jsonConfig)) {
      safeLocalStorage.setItem('jsonConfig', jsonConfig);
      toast.success('Configuration saved successfully.');
    } else {
      toast.error("Invalid JSON. Please check the configuration's syntax.");
    }
  }, [jsonConfig]);

  return (
    <div
      className={clsx(
        'fixed bottom-0 right-5 max-w-xs w-full flex flex-col rounded-md bg-slate-800 text-white text-sm z-20 transition-transform',
        isOpen ? 'translate-y-0' : 'translate-y-[740px]',
      )}
    >
      <button
        type="button"
        className="flex items-center p-4"
        onClick={() => setIsOpen(o => !o)}
      >
        <CreditCardIcon className="w-5 h-5" />
        <p className="uppercase ml-2">Configuration & Test cards</p>
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 ml-auto transition-transform',
            isOpen ? 'rotate-0' : 'rotate-180',
          )}
        />
      </button>
      <div className="p-4">
        <div>
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
        </div>

        <hr className="my-4" />

        <h3 className="text-base mb-1">Test cards</h3>
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
        <Link
          className="mt-5 text-center bg-indigo-600 rounded-md hover:bg-indigo-700 py-2 block"
          to="/integration-guide"
          target="_blank"
        >
          Integration Guide
        </Link>

        {/* <div className="pt-3 border-t mt-3 border-t-slate-400/40">
          <label htmlFor="flow_id" className="block text-sm font-medium">
            Flow ID
          </label>
          <div className="mt-1">
            <input
              id="flow_id"
              autoComplete="given-name"
              className="block w-full rounded-md bg-transparent border-slate-400/40 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="ZXPVbZ3"
              value={flowId}
              onChange={e => setFlowId(e.target.value)}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
