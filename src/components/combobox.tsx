import * as React from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from './button';

import cn from '../utils/cn';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ComboboxProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  format?: (option: { value: string; label: string }) => string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  ({ label, options, value, onChange, format }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full max-w-full justify-between',
              !value && 'text-gray-500 font-normal',
            )}
          >
            {value
              ? format
                ? format(options.find(option => option.value === value)!)
                : options.find(option => option.value === value)?.label
              : label}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label} ...`} />
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={currentValue => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {format ? format(option) : option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

export default Combobox;
