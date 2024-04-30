import * as React from 'react';
import Button from './button';
import Input from './input';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, ...props }, ref) => (
    <div className="flex items-center space-x-2">
      <Button
        className="flex-shrink-0"
        variant="secondary"
        onClick={() =>
          onChange(`${min ? Math.max(+value - 1, min) : +value - 1}`)
        }
      >
        -
      </Button>
      <Input
        ref={ref}
        type="number"
        min={0}
        onWheel={e => e.currentTarget.blur()}
        value={value}
        onChange={e => {
          if (min !== undefined && +e.target.value < min) {
            return onChange(`${min}`);
          }
          if (max !== undefined && +e.target.value > max) {
            return onChange(`${max}`);
          }
          return onChange(e.target.value);
        }}
        onKeyDown={e => {
          if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
          }
        }}
        {...props}
      />
      <Button
        className="flex-shrink-0"
        variant="secondary"
        onClick={() =>
          onChange(`${max ? Math.min(+value + 1, max) : +value + 1}`)
        }
      >
        +
      </Button>
    </div>
  ),
);

export default NumberInput;
