import { Settings, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { JsonEditor } from '@/components/jsonEditor';

import useJsonConfig from '@/store/useJsonConfig';
import safeLocalStorage from '@/utils/safeLocalStorage';
import { Input } from './ui/input';

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
  const { jsonConfig, setJsonConfig } = useJsonConfig();
  const [apiKey, setApiKey] = useState(
    () => safeLocalStorage.getItem('apiKey') || '',
  );

  const saveConfig = useCallback(() => {
    if (!jsonConfig) {
      toast.error('No configuration to save.');
      return;
    }
    if (isJsonValid(jsonConfig)) {
      safeLocalStorage.setItem('jsonConfig', jsonConfig);
      safeLocalStorage.setItem('apiKey', apiKey);
      toast.success('Configuration saved successfully.');
      setIsOpen(false);
    } else {
      toast.error("Invalid JSON. Please check the configuration's syntax.");
    }
  }, [jsonConfig, apiKey]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="space-x-1 text-subtle">
          <Settings className="w-5 h-5" />
          <span>Config</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            label="Account API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            containerClassName="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setApiKey('');
              safeLocalStorage.removeItem('apiKey');
            }}
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>

        <div>
          <p className="text-sm mb-2 text-subtle">Intent configuration</p>
          <JsonEditor value={jsonConfig} onChange={setJsonConfig} />
        </div>
        <Button className="mt-4 w-full" size="sm" onClick={saveConfig}>
          Save Configuration
        </Button>
      </PopoverContent>
    </Popover>
  );
}
