import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import RPNInput, {
  getCountryCallingCode,
  type FlagProps,
  type Country,
} from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input, InputProps } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/utils/cn';

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn('rounded-e-sm rounded-s-none', className)}
      containerClassName="w-full flex-1"
      {...props}
      label="Phone number"
      ref={ref}
    />
  ),
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  onChange: (value: Country) => void;
  options: CountrySelectOption[];
};

function CountrySelect({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) {
  const handleSelect = React.useCallback(
    (country: Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex rounded-e-none  focus:z-10 rounded-s-sm px-3 h-10"
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              'ml-1 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList className="max-h-none">
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <div className="max-h-72 overflow-y-auto">
              <CommandGroup>
                {options
                  .filter(x => x.value)
                  .map(option => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FlagComponent({ country, countryName }: FlagProps) {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
}
FlagComponent.displayName = 'FlagComponent';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<React.ComponentProps<typeof RPNInput>, 'onChange'> & {
    onChange?: (value: string) => void;
    value?: string;
    isError?: boolean;
  };

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput>,
  PhoneInputProps
>(({ className, onChange, ...props }, ref) => (
  <RPNInput
    ref={ref}
    className={cn('flex', className)}
    flagComponent={FlagComponent}
    countrySelectComponent={CountrySelect}
    inputComponent={InputComponent}
    /**
     * Handles the onChange event.
     *
     * react-phone-number-input might trigger the onChange event as undefined
     * when a valid phone number is not entered. To prevent this,
     * the value is coerced to an empty string.
     *
     * @param {E164Number | undefined} value - The entered value
     */
    onChange={value => onChange?.(value || '')}
    {...props}
  />
));
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
