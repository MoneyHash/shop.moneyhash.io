import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  type ElementStyles,
  type Elements,
  type ElementType,
} from '@moneyhash/js-sdk';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { moneyHash } from '@/utils/moneyHash';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';
import { getColorFromCssVariable } from '@/utils/getColorFromCssVariable';
import { useCallbackRef } from '@/hooks/useCallbackRef';
import { Button } from '@/components/ui/button';
import formatCurrency from '@/utils/formatCurrency';
import { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';
import { useTheme } from '@/context/themeProvider';

const CardFormContext = createContext<Elements | null>(null);

function CardFormProvider({
  children,
  onValidityChange,
}: {
  children: React.ReactNode;
  onValidityChange: (isValid: boolean) => void;
}) {
  const [elements] = useState(() =>
    moneyHash.elements({
      styles: {
        color: {
          base: getColorFromCssVariable('--foreground'),
          error: getColorFromCssVariable('--destructive'),
        },
        height: '40px',
        padding: '0.25rem 0.75rem',
      },
    }),
  );

  const onValidityChangeRef = useCallbackRef(onValidityChange);

  useEffect(() => {
    elements.on('validityChange', onValidityChangeRef);
  }, [elements, onValidityChangeRef]);

  return (
    <CardFormContext.Provider value={elements}>
      {children}
    </CardFormContext.Provider>
  );
}

function useCardFormContext() {
  const context = useContext(CardFormContext);
  if (!context) {
    throw new Error(
      'useCardFormContext must be used within a CardFormProvider',
    );
  }
  return context;
}

type FormFieldRef = Pick<
  ReturnType<Elements['create']>,
  'focus' | 'blur' | 'clear'
>;

function useMoneyHashFormField({
  elementType,
  onComplete,
  onBackspace,
  styles,
}: {
  elementType: ElementType;
  onComplete?: () => void;
  onBackspace?: () => void;
  styles?: ElementStyles;
}) {
  const elements = useCardFormContext();
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocus] = useState(false);
  const [isError, setIsError] = useState(false);
  const [length, setLength] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const [field] = useState(() => {
    if (elementType === 'cardHolderName') {
      return elements.create({
        elementType,
        elementOptions: {
          selector: `#${elementType}`,
          placeholder: ' ',
          validation: {
            required: true,
          },
          styles,
        },
      });
    }

    return elements.create({
      elementType,
      elementOptions: {
        selector: `#${elementType}`,
        placeholder: ' ',
        styles,
      },
    });
  });

  const onCompleteRef = useCallbackRef(onComplete);
  const onBackspaceRef = useCallbackRef(onBackspace);

  useEffect(() => {
    field.on('mount', () => setIsMounted(true));
    field.on('focus', () => setIsFocus(true));
    field.on('blur', () => setIsFocus(false));
    field.on('error', ({ isValid }) => setIsError(!isValid));
    field.on('changeInput', ({ length, isValid }) => {
      setLength(length);
      setIsValid(isValid);
      if (isValid) onCompleteRef?.();
    });

    if (onBackspaceRef) {
      field.on('key:Backspace', onBackspaceRef);
    }
    field.mount();
  }, [onCompleteRef, field, elements, elementType, onBackspaceRef]);

  return {
    field,
    length,
    isMounted,
    isFocused,
    isError,
    isValid,
    hasValue: length > 0,
  } as const;
}

const MoneyHashFormField = forwardRef<
  FormFieldRef,
  { elementType: ElementType; label: string; onComplete?: () => void }
>(({ elementType, label, onComplete }, ref) => {
  const { field, isMounted, isFocused, isError, hasValue } =
    useMoneyHashFormField({
      elementType,
      onComplete,
    });

  useImperativeHandle(
    ref,
    () => ({
      focus: field.focus,
      blur: field.blur,
      clear: field.clear,
    }),
    [field],
  );

  return (
    <div className="relative">
      {!isMounted && (
        <div className="absolute inset-0 cursor-wait animate-pulse rounded-sm" />
      )}
      <div
        className="peer border border-input h-10 rounded-sm"
        id={elementType}
      />

      <Label
        className={cn(
          'pointer-events-none z-0 absolute text-sm bg-background duration-150 transform origin-left px-2 text-subtle scale-100 -translate-y-1/2 top-1/2 peer-focus: peer-focus:scale-75 peer-focus:  start-1',
          isError && 'text-red-500',
          (isFocused || hasValue) &&
            'top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto',
          isFocused && !isError && 'text-ring',
        )}
      >
        {label}
      </Label>
    </div>
  );
});

function ExpiryFormField({ onComplete }: { onComplete: () => void }) {
  const {
    field: monthField,
    isMounted: monthIsMounted,
    isValid: monthIsValid,
    hasValue: monthHasValue,
    isError: monthIsError,
    isFocused: monthIsFocused,
  } = useMoneyHashFormField({
    elementType: 'cardExpiryMonth',
    styles: { padding: '0px 5px 0px 10px' },
    onComplete: () => yearField.focus(),
  });

  const {
    field: yearField,
    isMounted: yearIsMounted,
    hasValue: yearHasValue,
    isError: yearIsError,
    isFocused: yearIsFocused,
    length: yearLength,
  } = useMoneyHashFormField({
    elementType: 'cardExpiryYear',
    styles: { padding: '0px 10px' },
    onBackspace: () => {
      if (yearLength === 0) {
        monthField.clear();
        monthField.focus();
      }
    },
    onComplete,
  });

  useEffect(() => {
    if (yearIsFocused && !monthIsValid) {
      monthField.focus();
    }
  }, [monthField, monthIsValid, yearIsFocused]);

  const isMounted = monthIsMounted && yearIsMounted;
  const isFocused = monthIsFocused || yearIsFocused;
  const isError = monthIsError || yearIsError;
  const hasValue = monthHasValue || yearHasValue;

  return (
    <div className="relative">
      {!isMounted && (
        <div className="absolute inset-0 cursor-wait animate-pulse rounded-sm" />
      )}
      <div
        className={cn(
          'h-10 peer border border-input rounded-sm flex items-center',
          isFocused && 'MoneyHashElement MoneyHashElement--focus',
          isError && 'MoneyHashElement MoneyHashElement--error',
        )}
      >
        <div
          className={cn(
            'h-full w-12 border-none !ring-0',
            !monthIsValid && 'w-full',
          )}
          id="cardExpiryMonth"
        />
        <p className={cn('text-sm', monthIsValid ? ' block' : 'hidden')}>/</p>
        <div
          className={cn('h-full !ring-0', monthIsValid ? 'w-full' : 'w-0')}
          id="cardExpiryYear"
        />
      </div>
      <Label
        className={cn(
          'pointer-events-none absolute text-sm bg-background duration-150 transform z-10 origin-left px-2 text-subtle scale-100 -translate-y-1/2 top-1/2 peer-focus: peer-focus:scale-75 peer-focus:  start-1',
          isError && 'text-red-500',
          (isFocused || hasValue) &&
            'top-2 scale-75 -translate-y-4 rtl:translate-x-1/4 rtl:left-auto',
          isFocused && !isError && 'text-ring',
        )}
      >
        Expiry (MM/YY)
      </Label>
    </div>
  );
}
export function CardForm({
  accessToken,
  intentId,
  onIntentDetailsChange,
}: {
  accessToken: string;
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cvvRef = useRef<FormFieldRef | null>(null);
  const currency = useCurrency(state => state.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError(null);
    moneyHash
      .submitForm({
        intentId,
        accessToken,
      })
      .then(intentDetails => {
        const { stateDetails } = intentDetails;
        if (
          stateDetails &&
          'url' in stateDetails &&
          stateDetails.renderStrategy === 'REDIRECT'
        ) {
          window.location.href = stateDetails.url;
        } else {
          onIntentDetailsChange(intentDetails);
        }
      })
      .catch(errors => {
        const [error] = Object.values(errors);
        setError(error as string);
        setIsSubmitting(false);
      });
  };
  return (
    <CardFormProvider key={theme} onValidityChange={setIsValid}>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-full">
            <MoneyHashFormField elementType="cardNumber" label="Card number" />
          </div>
          <ExpiryFormField onComplete={() => cvvRef.current?.focus()} />
          <MoneyHashFormField ref={cvvRef} elementType="cardCvv" label="CVV" />
          <div className="col-span-full">
            <MoneyHashFormField
              elementType="cardHolderName"
              label="Name on card"
            />
          </div>
        </div>
        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          Pay{' '}
          {formatCurrency({
            currency,
            amount: totalPrice,
          })}
        </Button>
        {error && (
          <p className="text-sm text-center mt-2 text-destructive">{error}</p>
        )}
      </div>
    </CardFormProvider>
  );
}
