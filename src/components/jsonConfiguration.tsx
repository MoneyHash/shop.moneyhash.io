import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { JsonEditor } from '@/components/jsonEditor';

import useJsonConfig from '@/store/useJsonConfig';
import safeLocalStorage from '@/utils/safeLocalStorage';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { localEnv } from '@/utils/moneyHash';

function isJsonValid(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function JsonConfiguration() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="space-x-1 text-subtle">
          <Settings className="w-5 h-5" />
          <span>Config</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <ConfigurationContent onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function ConfigurationContent({ onClose }: { onClose: () => void }) {
  const { jsonConfig } = useJsonConfig();
  const [internalJsonConfig, setInternalJsonConfig] = useState(jsonConfig);
  const [apiKey, setApiKey] = useState(
    () => safeLocalStorage.getItem('apiKey') || '',
  );
  const [publicApiKey, setPublicApiKey] = useState(
    () => safeLocalStorage.getItem('publicApiKey') || '',
  );

  const saveConfig = () => {
    if (!internalJsonConfig) {
      toast.error('No configuration to save.');
      return;
    }

    // public api key and api key needs to be set together
    if (apiKey && !publicApiKey) {
      toast.error('Please set the public API key.');
      return;
    }

    if (!apiKey && publicApiKey) {
      toast.error('Please set the API key.');
      return;
    }

    if (isJsonValid(internalJsonConfig)) {
      safeLocalStorage.setItem('jsonConfig', internalJsonConfig);
      safeLocalStorage.setItem('apiKey', apiKey);
      safeLocalStorage.setItem('publicApiKey', publicApiKey);
      toast.success('Configuration saved successfully.');
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.error("Invalid JSON. Please check the configuration's syntax.");
    }
  };

  return (
    <div dir="ltr">
      <div>
        <p className="text-sm text-subtle mb-2">Environment</p>

        <ToggleGroup
          type="single"
          defaultValue={localEnv}
          variant="outline"
          size="sm"
          onValueChange={value => window.switchEnvironment(value)}
        >
          <ToggleGroupItem value="staging" className="flex-1">
            Staging
          </ToggleGroupItem>
          <ToggleGroupItem value="production" className="flex-1">
            Production
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <hr />

      <p className="text-sm mb-2 text-subtle">Custom Account</p>
      <div className="flex flex-col gap-3">
        <Input
          label="Account API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          containerClassName="flex-1"
        />
        <Input
          label="Public Account API Key"
          value={publicApiKey}
          onChange={e => setPublicApiKey(e.target.value)}
          containerClassName="flex-1"
        />
        <Button
          variant="destructive"
          onClick={() => {
            setApiKey('');
            setPublicApiKey('');
            safeLocalStorage.removeItem('apiKey');
            safeLocalStorage.removeItem('publicApiKey');
            window.location.reload();
          }}
          className="flex items-center gap-3"
        >
          <span>Clear API Keys</span>
        </Button>
      </div>

      <hr />
      <div>
        <p className="text-sm mb-2 text-subtle">Intent configuration</p>
        <JsonEditor
          value={internalJsonConfig}
          onChange={setInternalJsonConfig}
        />
      </div>
      <Button className="mt-4 w-full" size="sm" onClick={saveConfig}>
        Save Configuration
      </Button>
    </div>
  );
}
