import { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import JsonEditor from './jsonEditor';
import safeLocalStorage from '../utils/safeLocalStorage';
import { environments, localEnv, type Env } from '../utils/environment';
import { hasAccountKeys } from '../api';
import useJsonConfig, { DEFAULT_JSON_CONFIG } from '../store/useJsonConfig';

const envLabels: Record<Env, string> = {
  staging: 'Staging',
  production: 'Production',
  preprod: 'Pre-Prod',
};

const inputClassName =
  'block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm';

function parseJsonObject(str: string) {
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // fallthrough
  }
  return null;
}

export function EnvironmentSelect() {
  return (
    <>
      <label htmlFor="environment" className="sr-only">
        Environment
      </label>
      <select
        id="environment"
        value={localEnv}
        className="border-none rounded-md bg-transparent"
        title="Switching environment reloads the page"
        onChange={e => window.switchEnvironment(e.target.value)}
      >
        {environments.map(env => (
          <option key={env} value={env}>
            {envLabels[env]}
          </option>
        ))}
      </select>
    </>
  );
}

export default function Configuration() {
  // Keys only change on save/clear, which reloads the page.
  const missingKeys = !hasAccountKeys();

  return (
    <Popover className="relative">
      <Popover.Button
        className={clsx(
          'relative flex items-center gap-1 rounded-md px-2 py-1.5 font-medium hover:text-decathlon focus:outline-none focus-visible:ring-2 focus-visible:ring-decathlon',
          missingKeys && 'ring-2 ring-decathlon/60',
        )}
        title={missingKeys ? 'Add your API keys' : undefined}
      >
        <Cog6ToothIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Config</span>
        {missingKeys && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-decathlon opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-decathlon" />
          </span>
        )}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="fixed inset-x-4 top-16 z-30 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-md border border-gray-200 bg-white p-4 shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
          {({ close }) => <ConfigurationContent onClose={close} />}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

function ConfigurationContent({ onClose }: { onClose: () => void }) {
  const { jsonConfig, setJsonConfig } = useJsonConfig();
  const [draftJson, setDraftJson] = useState(jsonConfig);
  const [apiKey, setApiKey] = useState(
    () => safeLocalStorage.getItem('apiKey') || '',
  );
  const [publicApiKey, setPublicApiKey] = useState(
    () => safeLocalStorage.getItem('publicApiKey') || '',
  );

  const saveConfig = () => {
    // Both keys are needed: the account key creates intents, the public key
    // initializes the SDK.
    if (!apiKey.trim() || !publicApiKey.trim()) {
      toast.error('Please set both API keys.');
      return;
    }
    const parsed = parseJsonObject(draftJson);
    if (!parsed) {
      toast.error(
        'Invalid JSON. It must be an object, e.g. { "flow_id": "…" }',
      );
      return;
    }

    safeLocalStorage.setItem('apiKey', apiKey.trim());
    safeLocalStorage.setItem('publicApiKey', publicApiKey.trim());
    setJsonConfig(JSON.stringify(parsed, null, 2));
    toast.success('Configuration saved.');
    onClose();
    // The SDK reads the public key at construction, so reload to apply it.
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-3">
        <p className="text-gray-500">Account API Keys</p>
        <div>
          <label
            htmlFor="config-api-key"
            className="block text-xs text-gray-500 mb-1"
          >
            Account API Key
          </label>
          <input
            id="config-api-key"
            className={inputClassName}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Paste your account API key"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div>
          <label
            htmlFor="config-public-api-key"
            className="block text-xs text-gray-500 mb-1"
          >
            Public Account API Key
          </label>
          <input
            id="config-public-api-key"
            className={inputClassName}
            value={publicApiKey}
            onChange={e => setPublicApiKey(e.target.value)}
            placeholder="Paste your public API key"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="button"
          className="text-xs text-red-600 hover:underline"
          onClick={() => {
            safeLocalStorage.removeItem('apiKey');
            safeLocalStorage.removeItem('publicApiKey');
            window.location.reload();
          }}
        >
          Clear API keys
        </button>
      </div>

      <hr />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500">Intent configuration</p>
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-decathlon"
            onClick={() => setDraftJson(DEFAULT_JSON_CONFIG)}
          >
            Reset
          </button>
        </div>
        <JsonEditor value={draftJson} onChange={setDraftJson} />
        <p className="mt-1 text-xs text-gray-400">
          Merged into the create-intent payload (e.g. flow_id, operation).
        </p>
      </div>

      <button
        type="button"
        className="w-full rounded-md bg-decathlon py-2 font-medium text-white hover:bg-decathlon-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-decathlon focus-visible:ring-offset-2"
        onClick={saveConfig}
      >
        Save Configuration
      </button>
    </div>
  );
}
