import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ElementStyles,
  Elements,
  ElementType,
  Field,
  PaymentMethodSlugs,
} from '@moneyhash/js-sdk';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import * as v from 'valibot';
import { CreditCardIcon } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input/max';

import { Controller, useForm, type Control } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
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
import useConfiguration from '@/store/useConfiguration';
import { PhoneInput } from '@/components/ui/phoneInput';
import { Input } from '@/components/ui/input';

const CardFormContext = createContext<Elements | null>(null);

function CardFormProvider({
  children,
  onValidityChange,
}: {
  children: React.ReactNode;
  onValidityChange: (isValid: boolean) => void;
}) {
  const configurationFontFamily = useConfiguration(state => state.fontFamily);
  const [elements] = useState(() =>
    moneyHash.elements({
      styles: {
        color: {
          base: getColorFromCssVariable('--foreground'),
          error: getColorFromCssVariable('--destructive'),
        },
        placeholderColor: getColorFromCssVariable('--text-subtler'),
        height: '40px',
        padding: '0.25rem 0.75rem',
        fontFamily: configurationFontFamily || undefined,
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
  placeholder = ' ',
  onCardBrandChange,
}: {
  elementType: ElementType;
  onComplete?: () => void;
  onBackspace?: () => void;
  styles?: ElementStyles;
  placeholder?: string;
  onCardBrandChange?: (cardInfo: {
    brand: string;
    brandIconUrl: string;
  }) => void;
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
          placeholder,
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
        placeholder,
        styles,
      },
    });
  });

  const onCompleteRef = useCallbackRef(onComplete);
  const onBackspaceRef = useCallbackRef(onBackspace);
  const onCardBrandChangeRef = useCallbackRef(onCardBrandChange);

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

    if (onCardBrandChangeRef) {
      field.on('cardNumberChange', onCardBrandChangeRef);
    }

    field.mount();

    return () => {
      field.off('mount');
      field.off('focus');
      field.off('blur');
      field.off('error');
      field.off('changeInput');
      field.off('key:Backspace');
      field.off('cardNumberChange');
    };
  }, [
    onCompleteRef,
    field,
    elements,
    elementType,
    onBackspaceRef,
    onCardBrandChangeRef,
  ]);

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

function ExpandedCardForm() {
  const cvvRef = useRef<FormFieldRef | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-full">
        <MoneyHashFormField elementType="cardNumber" label="Card number" />
      </div>
      <ExpiryFormField onComplete={() => cvvRef.current?.focus()} />
      <MoneyHashFormField ref={cvvRef} elementType="cardCvv" label="CVV" />
      <div className="col-span-full">
        <MoneyHashFormField elementType="cardHolderName" label="Name on card" />
      </div>
    </div>
  );
}

function CompactCardForm() {
  const [cardInfo, setCardInfo] = useState<{
    brand: string;
    brandIconUrl: string;
  } | null>(null);

  const {
    field: cardNumberField,
    isMounted: cardNumberIsMounted,
    isFocused: cardNumberIsFocused,
  } = useMoneyHashFormField({
    elementType: 'cardNumber',
    placeholder: 'Card number',
    styles: {
      padding: '0px 5px 0px 40px',
    },
    onCardBrandChange: setCardInfo,
  });

  const {
    field: monthField,
    isMounted: monthIsMounted,
    isFocused: monthIsFocused,
    length: monthLength,
    isValid: monthIsValid,
  } = useMoneyHashFormField({
    elementType: 'cardExpiryMonth',
    placeholder: 'MM',
    styles: { padding: '0px 5px' },
    onComplete: () => yearField.focus(),
    onBackspace: () => {
      if (monthLength === 0) {
        cardNumberField.focus();
      }
    },
  });

  const {
    field: yearField,
    isMounted: yearIsMounted,
    isFocused: yearIsFocused,
    length: yearLength,
  } = useMoneyHashFormField({
    elementType: 'cardExpiryYear',
    placeholder: 'YY',
    styles: { padding: '0px 5px' },
    onBackspace: () => {
      if (yearLength === 0) {
        monthField.focus();
      }
    },
    onComplete: () => cvvField.focus(),
  });

  const {
    field: cvvField,
    isMounted: cvvIsMounted,
    isFocused: cvvIsFocused,
    length: cvvLength,
  } = useMoneyHashFormField({
    elementType: 'cardCvv',
    placeholder: 'CVV',
    styles: { padding: '0px 0px 0px 10px' },
    onBackspace: () => {
      if (cvvLength === 0) {
        yearField.focus();
      }
    },
  });

  const isMounted =
    cardNumberIsMounted && monthIsMounted && yearIsMounted && cvvIsMounted;
  const isFocused =
    cardNumberIsFocused || monthIsFocused || yearIsFocused || cvvIsFocused;

  return (
    <div className="relative">
      {!isMounted && (
        <div className="absolute inset-0 cursor-wait rounded-sm" />
      )}

      <div
        className={cn(
          'h-10 peer border border-input rounded-sm grid grid-cols-11 sm:grid-cols-10',
          isFocused && 'MoneyHashElement MoneyHashElement--focus',
        )}
      >
        <div className="relative col-span-6 sm:col-span-7">
          <div id="cardNumber" className="!ring-0 !border-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-2 ">
            {!cardInfo || cardInfo.brand === 'Unknown' ? (
              <CreditCardIcon className="text-subtler pointer-events-none" />
            ) : (
              <img className="w-6 h-6" src={cardInfo.brandIconUrl} alt="" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 col-span-5 sm:col-span-3">
          <div className="flex items-center *:shrink-0">
            <div
              id="cardExpiryMonth"
              className="!ring-0 !border-none basis-[38px]"
            />

            <p className={cn(monthIsValid ? 'text-inherit' : 'text-subtler')}>
              /
            </p>
            <div
              id="cardExpiryYear"
              className="!ring-0 !border-none basis-[38px]"
            />
          </div>
          <div id="cardCvv" className="!ring-0 !border-none" />
        </div>
      </div>
    </div>
  );
}

export function CardForm({
  paymentMethod,
  accessToken,
  intentId,
  onIntentDetailsChange,
  billingFields,
}: {
  paymentMethod: PaymentMethodSlugs;
  accessToken: string | null;
  billingFields: Field[] | null;
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidCardForm, setIsValidCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrency(state => state.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();
  const cardForm = useConfiguration(state => state.cardForm);

  const billingValibotSchema = useMemo(() => {
    if (!billingFields) return undefined;
    const objectSchema = billingFields.reduce((acc, field) => {
      const validationRules = [
        field.validation.required && v.nonEmpty(),
        field.type === 'email' && v.email(),
        field.type === 'phoneNumber' &&
          v.check(isValidPhoneNumber, 'Invalid phone number'),
      ].filter(Boolean);

      acc[field.name] = v.pipe(
        v.string(),
        v.trim(),
        ...(validationRules as []),
      );
      return acc;
    }, {} as any);

    return v.object(objectSchema);
  }, [billingFields]);

  const {
    formState: { isValid },
    control,
    getValues: getBillingValues,
  } = useForm({
    mode: 'onTouched',
    resolver: billingValibotSchema
      ? valibotResolver(billingValibotSchema)
      : undefined,
    defaultValues: billingFields?.reduce((acc, field) => {
      acc[field.name] = field.value ?? '';
      return acc;
    }, {} as Record<string, string>),
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError(null);
    moneyHash
      .submitForm({
        paymentMethod,
        intentId,
        accessToken,
        billingData: getBillingValues(),
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
    <CardFormProvider key={theme} onValidityChange={setIsValidCardForm}>
      <div className="p-4 space-y-4">
        {billingFields && (
          <DynamicFields
            title="Billing Details"
            fields={billingFields}
            control={control}
          />
        )}

        {accessToken &&
          (cardForm === 'compact' ? <CompactCardForm /> : <ExpandedCardForm />)}
        <div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              (accessToken && !isValidCardForm) || !isValid || isSubmitting
            }
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
      </div>
    </CardFormProvider>
  );
}

function DynamicFields({
  title,
  fields,
  control,
}: {
  title: string;
  fields: Field[];
  control: Control;
}) {
  return (
    <div>
      <p className="text-sm text-center flex items-center before:h-px before:bg-border after:h-px after:bg-border before:flex-1 after:flex-1 gap-3">
        {title}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {fields.map(field => (
          <DynamicField key={field.name} control={control} field={field} />
        ))}
      </div>
    </div>
  );
}

function DynamicField({ field, control }: { field: Field; control: Control }) {
  if (field.type === 'phoneNumber') {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field, fieldState }) => (
          <PhoneInput {...field} isError={!!fieldState.error} />
        )}
      />
    );
  }

  if (field.type === 'email') {
    return (
      <Controller
        control={control}
        name={field.name}
        render={({ field: rhfField, fieldState }) => (
          <Input
            type="email"
            id={field.name}
            label={field.label}
            {...rhfField}
            isError={fieldState.invalid}
          />
        )}
      />
    );
  }
  return null;
}
