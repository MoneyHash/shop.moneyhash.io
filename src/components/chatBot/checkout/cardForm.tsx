import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Elements, ElementStyles, ElementType } from '@moneyhash/js-sdk';
import type { CardData } from '@moneyhash/js-sdk/headless';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  LoaderIcon,
  LockIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { moneyHash } from '@/utils/moneyHash';
import { getColorFromCssVariable } from '@/utils/getColorFromCssVariable';
import { useCallbackRef } from '@/hooks/useCallbackRef';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const CardElementsContext = createContext<Elements | null>(null);

function useElements() {
  const ctx = useContext(CardElementsContext);
  if (!ctx) throw new Error('Card field used outside CardElementsProvider');
  return ctx;
}

type CardElement = ReturnType<Elements['create']>;
type FieldRef = Pick<CardElement, 'focus' | 'blur' | 'clear'>;

function useChatbotFormField({
  elementType,
  styles,
  onComplete,
  onBackspace,
}: {
  elementType: ElementType;
  styles?: ElementStyles;
  onComplete?: () => void;
  onBackspace?: () => void;
}) {
  const elements = useElements();
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [length, setLength] = useState(0);

  const onCompleteRef = useCallbackRef(onComplete);
  const onBackspaceRef = useCallbackRef(onBackspace);

  const [field] = useState(() => {
    if (elementType === 'cardNumber') {
      return elements.create({
        elementType: 'cardNumber',
        elementOptions: {
          selector: `#mh-${elementType}`,
          placeholder: ' ',
          styles,
          validation: { cardNumber: true },
        },
      });
    }
    if (elementType === 'cardHolderName') {
      return elements.create({
        elementType: 'cardHolderName',
        elementOptions: {
          selector: `#mh-${elementType}`,
          placeholder: ' ',
          styles,
          validation: { required: true },
        },
      });
    }
    return elements.create({
      elementType,
      elementOptions: {
        selector: `#mh-${elementType}`,
        placeholder: ' ',
        styles,
      },
    });
  });

  useEffect(() => {
    field.on('mount', () => setIsMounted(true));
    field.on('focus', () => setIsFocused(true));
    field.on('blur', () => setIsFocused(false));
    field.on('error', ({ isValid: valid }) => setIsError(!valid));
    field.on('changeInput', ({ length: len, isValid: valid }) => {
      setLength(len);
      setIsValid(valid);
      if (valid) onCompleteRef?.();
    });
    if (onBackspaceRef) {
      field.on('key:Backspace', onBackspaceRef);
    }
    field.mount();

    return () => {
      field.off('mount');
      field.off('focus');
      field.off('blur');
      field.off('error');
      field.off('changeInput');
      field.off('key:Backspace');
    };
  }, [field, onCompleteRef, onBackspaceRef]);

  return {
    field,
    isMounted,
    isFocused,
    isError,
    isValid,
    length,
    hasValue: length > 0,
  } as const;
}

const ChatbotFormField = forwardRef<
  FieldRef,
  {
    elementType: ElementType;
    label: string;
    onComplete?: () => void;
    styles?: ElementStyles;
  }
>(({ elementType, label, onComplete, styles }, ref) => {
  const { field, isMounted, isFocused, isError, hasValue } =
    useChatbotFormField({ elementType, onComplete, styles });

  useImperativeHandle(
    ref,
    () => ({ focus: field.focus, blur: field.blur, clear: field.clear }),
    [field],
  );

  return (
    <div className="relative">
      {!isMounted && (
        <div className="absolute inset-0 animate-pulse rounded-md bg-muted/40" />
      )}
      <div
        id={`mh-${elementType}`}
        dir={
          elementType === 'cardNumber' || elementType === 'cardCvv'
            ? 'ltr'
            : undefined
        }
        className={cn(
          'peer h-10 rounded-md border border-input bg-background transition-colors',
          'hover:border-input/70',
          isFocused && 'MoneyHashElement MoneyHashElement--focus',
          isError && 'MoneyHashElement MoneyHashElement--error',
        )}
      />
      <Label
        className={cn(
          'pointer-events-none absolute start-1 top-1/2 z-0 origin-left rtl:origin-right -translate-y-1/2 scale-100 bg-background px-2 text-sm text-subtle transition-all duration-200',
          isError && 'text-red-500',
          (isFocused || hasValue) &&
            'top-2 -translate-y-4 scale-75 font-medium',
          isFocused && !isError && 'text-ring',
        )}
      >
        {label}
      </Label>
    </div>
  );
});
ChatbotFormField.displayName = 'ChatbotFormField';

function ExpiryField({ onComplete }: { onComplete: () => void }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const {
    field: monthField,
    isMounted: monthIsMounted,
    isValid: monthIsValid,
    isFocused: monthIsFocused,
    isError: monthIsError,
    hasValue: monthHasValue,
  } = useChatbotFormField({
    elementType: 'cardExpiryMonth',
    styles: {
      direction: 'ltr',
      textAlign: isArabic ? 'right' : 'left',
      padding: isArabic ? '0px 10px 0px 5px' : '0px 5px 0px 10px',
    },
    onComplete: () => yearField.focus(),
  });

  const {
    field: yearField,
    isMounted: yearIsMounted,
    isFocused: yearIsFocused,
    isError: yearIsError,
    hasValue: yearHasValue,
    length: yearLength,
  } = useChatbotFormField({
    elementType: 'cardExpiryYear',
    styles: {
      direction: 'ltr',
      textAlign: isArabic ? 'right' : 'left',
      padding: '0px 10px',
    },
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
        <div className="absolute inset-0 animate-pulse rounded-md bg-muted/40" />
      )}
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className={cn(
          'peer flex h-10 items-center rounded-md border border-input bg-background transition-colors',
          'hover:border-input/70',
          isFocused && 'MoneyHashElement MoneyHashElement--focus',
          isError && 'MoneyHashElement MoneyHashElement--error',
        )}
      >
        <div
          id="mh-cardExpiryMonth"
          className={cn('h-full', monthIsValid ? 'w-12' : 'w-full')}
        />
        <span
          className={cn(
            'text-sm text-subtle',
            monthIsValid ? 'block' : 'hidden',
          )}
        >
          /
        </span>
        <div
          id="mh-cardExpiryYear"
          className={cn('h-full', monthIsValid ? 'w-full' : 'w-0')}
        />
      </div>
      <Label
        className={cn(
          'pointer-events-none absolute start-1 top-1/2 z-0 origin-left rtl:origin-right -translate-y-1/2 scale-100 bg-background px-2 text-sm text-subtle transition-all duration-200',
          isError && 'text-red-500',
          (isFocused || hasValue) &&
            'top-2 -translate-y-4 scale-75 font-medium',
          isFocused && !isError && 'text-ring',
        )}
      >
        {t('chatBot.checkout.card.expiry')}
      </Label>
    </div>
  );
}

function ChatbotCardFields() {
  const { t, i18n } = useTranslation();
  const cvvRef = useRef<FieldRef | null>(null);
  const isArabic = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="col-span-full">
        <ChatbotFormField
          elementType="cardHolderName"
          label={t('chatBot.checkout.card.cardholderName')}
          styles={{
            direction: isArabic ? 'rtl' : 'ltr',
            textAlign: isArabic ? 'right' : 'left',
          }}
        />
      </div>
      <div className="col-span-full">
        <ChatbotFormField
          elementType="cardNumber"
          label={t('chatBot.checkout.card.cardNumber')}
          styles={{
            direction: 'ltr',
            textAlign: isArabic ? 'right' : 'left',
          }}
        />
      </div>
      <ExpiryField onComplete={() => cvvRef.current?.focus()} />
      <ChatbotFormField
        ref={cvvRef}
        elementType="cardCvv"
        label={t('chatBot.checkout.card.cvv')}
        styles={{
          direction: 'ltr',
          textAlign: isArabic ? 'right' : 'left',
        }}
      />
    </div>
  );
}

const ACCEPTED_BRANDS = ['VISA', 'MC', 'AMEX'] as const;

export function CardBrandStack() {
  return (
    <div className="flex items-center gap-1">
      {ACCEPTED_BRANDS.map(brand => (
        <span
          key={brand}
          className="rounded bg-background px-1.5 py-[3px] font-mono text-[8px] font-bold tracking-[0.12em] text-muted-foreground/70 ring-1 ring-border/60"
        >
          {brand}
        </span>
      ))}
    </div>
  );
}

export function CardForm({
  onPay,
  isSubmitting,
}: {
  onPay: (cardData: CardData) => Promise<void>;
  isSubmitting: boolean;
}) {
  const { t } = useTranslation();
  const [elements] = useState(() =>
    moneyHash.elements({
      styles: {
        color: {
          base: getColorFromCssVariable('--foreground'),
          error: getColorFromCssVariable('--destructive'),
        },
        placeholderColor: getColorFromCssVariable('--muted-foreground'),
        height: '40px',
        padding: '0.25rem 0.75rem',
      },
    }),
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFieldError(null);
    let cardData: CardData;
    try {
      cardData = await moneyHash.cardForm.collect();
    } catch (errors) {
      const firstError =
        errors && typeof errors === 'object'
          ? Object.values(errors as Record<string, unknown>)[0]
          : errors;
      setFieldError(
        typeof firstError === 'string'
          ? firstError
          : t('chatBot.checkout.errors.paymentFailed'),
      );
      return;
    }
    await onPay(cardData);
  };

  return (
    <CardElementsContext.Provider value={elements}>
      <div className="space-y-2.5">
        <ChatbotCardFields />

        {fieldError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/[0.06] px-2.5 py-1.5"
          >
            <AlertCircleIcon className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <p className="text-[11px] font-medium leading-snug text-destructive">
              {fieldError}
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group w-full"
        >
          {isSubmitting ? (
            <>
              <LoaderIcon className="me-1.5 size-3 animate-spin" />
              {t('chatBot.checkout.card.processing')}
            </>
          ) : (
            <>
              <LockIcon className="me-1.5 size-3" strokeWidth={2.5} />
              {t('chatBot.checkout.card.buyNow')}
              <ArrowRightIcon
                className="ms-1.5 size-3 transition-transform duration-150 ltr:group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                strokeWidth={2.5}
              />
            </>
          )}
        </Button>
      </div>
    </CardElementsContext.Provider>
  );
}

export function CardFormSkeleton() {
  return (
    <div
      data-fill-bubble
      className="w-full overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm"
    >
      <div className="flex items-center gap-2.5 bg-muted/30 px-3 py-2.5">
        <div className="size-7 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-20 animate-pulse rounded-sm bg-muted" />
          <div className="h-2.5 w-32 animate-pulse rounded-sm bg-muted/70" />
        </div>
      </div>
      <div className="space-y-2.5 p-3">
        <div className="h-10 animate-pulse rounded-md bg-muted/60" />
        <div className="h-10 animate-pulse rounded-md bg-muted/60" />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-10 animate-pulse rounded-md bg-muted/60" />
          <div className="h-10 animate-pulse rounded-md bg-muted/60" />
        </div>
      </div>
      <div className="flex items-stretch gap-2 border-t border-border/60 bg-muted/20 px-3 py-2.5">
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted/70" />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-dashed border-border/80 bg-muted/10 px-3 py-2">
        <div className="h-2 w-16 animate-pulse rounded-sm bg-muted/60" />
        <div className="h-2 w-12 animate-pulse rounded-sm bg-muted/50" />
      </div>
    </div>
  );
}
