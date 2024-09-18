import { Settings } from 'lucide-react';
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

  const saveConfig = useCallback(() => {
    if (!jsonConfig) {
      toast.error('No configuration to save.');
      return;
    }
    if (isJsonValid(jsonConfig)) {
      safeLocalStorage.setItem('jsonConfig', jsonConfig);
      toast.success('Configuration saved successfully.');
      setIsOpen(false);
    } else {
      toast.error("Invalid JSON. Please check the configuration's syntax.");
    }
  }, [jsonConfig]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="space-x-1 text-subtle">
          <Settings className="w-5 h-5" />
          <span>Config</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="text-sm mb-2 text-subtle">Intent configuration</p>
        <JsonEditor value={jsonConfig} onChange={setJsonConfig} />
        <Button className="mt-4 w-full" size="sm" onClick={saveConfig}>
          Save Configuration
        </Button>
      </PopoverContent>
    </Popover>
  );
}
