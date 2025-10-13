import * as React from 'react';

import { cn } from '@/utils/cn';
import { Label } from '@/components/ui/label';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  containerClassName?: string;
  isError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { containerClassName, isError, label, className, id, type, ...props },
    ref,
  ) => (
    <div className={cn('relative', containerClassName)}>
      <input
        id={id}
        type={type}
        className={cn(
          'peer flex h-10 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
          isError
            ? 'border-red-500 ring-2 ring-red-500/20'
            : 'focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        )}
        placeholder=" "
        ref={ref}
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute text-sm bg-background duration-150 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 text-subtle peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1',
          isError ? 'text-red-500' : ' peer-focus:text-ring',
        )}
      >
        {label}
      </Label>
    </div>
  ),
);
Input.displayName = 'Input';

export { Input };
