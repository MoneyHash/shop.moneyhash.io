import { cn } from '@/utils/cn';

interface SelectProps<TValue>
  extends Omit<React.ComponentProps<'select'>, 'value' | 'onChange'> {
  onChange: (value: TValue) => void;
  value: TValue;
}
export function Select<TValue extends string>({
  className,
  onChange,
  ...props
}: SelectProps<TValue>) {
  return (
    <select
      className={cn(
        'flex h-9 w-full rounded-sm bg-transparent px-2 py-1 text-sm transition-colors focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 text-subtle',
        className,
      )}
      onChange={e => onChange(e.target.value as unknown as TValue)}
      {...props}
    />
  );
}
