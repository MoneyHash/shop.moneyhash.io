import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { DateRange } from 'react-day-picker';

import cn from '../utils/cn';
import Button from './button';
import Calendar from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerWithRangeProps {
  className?: string;
  label: string;
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
}

const DatePickerWithRange = React.forwardRef<
  HTMLButtonElement,
  DatePickerWithRangeProps
>(({ className, label, value, onChange }, ref) => (
  <div className={cn('grid gap-2', className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          id="date"
          variant="outline"
          className={cn(
            'w-full max-w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'LLL dd, y')} -{' '}
                {format(value.to, 'LLL dd, y')}
              </>
            ) : (
              format(value.from, 'LLL dd, y')
            )
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          fromDate={new Date()}
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  </div>
));

export default DatePickerWithRange;
