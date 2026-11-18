import { useState } from 'react';
import toast from 'react-hot-toast';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import Button from './button';
import Input from './input';
import JsonEditor from './jsonEditor';
import cn from '../utils/cn';
import safeLocalStorage from '../utils/safeLocalStorage';
import { environments, localEnv, type Env } from '../utils/environment';
import { hasAccountKey } from '../api';
import useJsonConfig, { DEFAULT_JSON_CONFIG } from '../store/useJsonConfig';

const envLabels: Record<Env, string> = {
  staging: 'Staging',
  production: 'Production',
  preprod: 'Pre-Prod',
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [missingKey, setMissingKey] = useState(() => !hasAccountKey());

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'relative flex items-center gap-1 rounded-md px-2 py-1.5 font-medium hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary',
            missingKey && 'ring-2 ring-primary/60',
          )}
          title={missingKey ? 'Add your API key' : undefined}
        >
          <Cog6ToothIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Config</span>
          {missingKey && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)]">
        <ConfigurationContent
          onSaved={() => {
            setMissingKey(!hasAccountKey());
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function ConfigurationContent({ onSaved }: { onSaved: () => void }) {
  const { jsonConfig, setJsonConfig } = useJsonConfig();
  const [draftJson, setDraftJson] = useState(jsonConfig);
  const [apiKey, setApiKey] = useState(
    () => safeLocalStorage.getItem('apiKey') || '',
  );

  const saveConfig = () => {
    if (!apiKey.trim()) {
      toast.error('Please set the account API key.');
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
    setJsonConfig(JSON.stringify(parsed, null, 2));
    toast.success('Configuration saved.');
    onSaved();
  };

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label htmlFor="config-api-key" className="block text-gray-500 mb-2">
          Account API Key
        </label>
        <Input
          id="config-api-key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Paste your account API key"
          autoComplete="off"
          spellCheck={false}
        />
        <Button
          variant="link"
          size="sm"
          className="px-0 h-auto mt-1 text-xs"
          onClick={() => {
            setApiKey('');
            safeLocalStorage.removeItem('apiKey');
            onSaved();
            toast.success('API key cleared.');
          }}
        >
          Clear API key
        </Button>
      </div>

      <hr />

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500">Intent configuration</p>
          <button
            type="button"
            className="text-xs text-gray-400 hover:text-primary"
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

      <Button className="w-full" size="sm" onClick={saveConfig}>
        Save Configuration
      </Button>
    </div>
  );
}
