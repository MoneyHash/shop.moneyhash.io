import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { CheckIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export default function AccordionSteps({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      value={value}
      onValueChange={onChange}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

AccordionSteps.Step = AccordionStep;

function AccordionStep({
  title,
  children,
  stepIndex,
  activeStep,
}: {
  title: string;
  children: React.ReactNode;
  stepIndex: number;
  activeStep: number;
}) {
  const isCompleted = activeStep > stepIndex;
  return (
    <AccordionPrimitive.Item value={`${stepIndex}`}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          disabled={stepIndex > activeStep}
          className={clsx(
            'flex items-center py-6 text-lg font-medium w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-decathlon rounded-md',
            isCompleted ? 'space-x-3' : 'space-x-4',
          )}
        >
          {isCompleted ? (
            <div className="border rounded-full border-decathlon w-7 h-7 flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-decathlon" />
            </div>
          ) : (
            <span>{`${stepIndex + 1}`.padStart(2, '0')}.</span>
          )}
          <h2 className="text-lg font-medium">{title}</h2>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="pl-8 pr-1 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden">
        {children}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
