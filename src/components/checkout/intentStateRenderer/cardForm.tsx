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
  MaskedCard,
} from '@moneyhash/js-sdk';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import * as v from 'valibot';
import { CreditCardIcon } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input/max';
import { useTranslation } from 'react-i18next';

import { Controller, useForm, type Control } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import toast from 'react-hot-toast';
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
import { logJSON } from '@/utils/logJSON';
import { useMoneyHash } from '@/context/moneyHashProvider';
import type { InfoFormValues } from '../infoForm';

const CardFormContext = createContext<Elements | null>(null);

function CardFormProvider({
  children,
  onValidityChange,
}: {
  children: React.ReactNode;
  onValidityChange: (isValid: boolean) => void;
}) {
  const moneyHash = useMoneyHash();
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
    <CardFormContext.Provider value={elements as Elements}>
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

    if (elementType === 'cardNumber') {
      return elements.create({
        elementType: 'cardNumber',
        elementOptions: {
          selector: `#${elementType}`,
          placeholder,
          styles,
          validation: {
            cardNumber: true,
          },
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
  const { t } = useTranslation();
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
          'pointer-events-none absolute text-sm bg-background duration-150 transform z-10 origin-[0] px-2 text-subtle scale-100 -translate-y-1/2 top-1/2 peer-focus: peer-focus:scale-75 peer-focus:  start-1',
          isError && 'text-red-500',
          (isFocused || hasValue) && 'top-2 scale-75 -translate-y-4',
          isFocused && !isError && 'text-ring',
        )}
      >
        {t('payment.expiry')}
      </Label>
    </div>
  );
}

function ExpandedCardForm() {
  const { t } = useTranslation();
  const cvvRef = useRef<FormFieldRef | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-full">
        <MoneyHashFormField
          elementType="cardNumber"
          label={t('payment.cardNumber')}
        />
      </div>
      <ExpiryFormField onComplete={() => cvvRef.current?.focus()} />
      <MoneyHashFormField
        ref={cvvRef}
        elementType="cardCvv"
        label={t('payment.cvv')}
      />
      <div className="col-span-full">
        <MoneyHashFormField
          elementType="cardHolderName"
          label={t('payment.nameOnCard')}
        />
      </div>
    </div>
  );
}

function CompactCardForm() {
  const [cardInfo, setCardInfo] = useState<{
    brand: string;
    brandIconUrl: string;
  } | null>(null);

  const { t, i18n } = useTranslation();

  const {
    field: cardNumberField,
    isMounted: cardNumberIsMounted,
    isFocused: cardNumberIsFocused,
  } = useMoneyHashFormField({
    elementType: 'cardNumber',
    placeholder: t('payment.cardNumberPlaceholder'),
    styles: {
      padding: i18n.language === 'ar' ? '0px 40px 0px 5px' : '0px 5px 0px 40px',
      textAlign: i18n.language === 'ar' ? 'right' : 'left',
      direction: 'ltr',
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
    placeholder: t('payment.monthPlaceholder'),
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
    placeholder: t('payment.yearPlaceholder'),
    styles: {
      padding: '0px 5px',
      direction: 'ltr',
    },
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
    placeholder: t('payment.cvvPlaceholder'),
    styles: {
      padding: '0px 0px 0px 10px',
      direction: 'ltr',
    },
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
          <div className="absolute top-1/2 -translate-y-1/2 start-2">
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
              dir="ltr"
              id="cardExpiryMonth"
              className="!ring-0 !border-none basis-[38px]"
            />

            <p className={cn(monthIsValid ? 'text-inherit' : 'text-subtler')}>
              /
            </p>
            <div
              dir="ltr"
              id="cardExpiryYear"
              className="!ring-0 !border-none basis-[38px]"
            />
          </div>
          <div dir="ltr" id="cardCvv" className="!ring-0 !border-none" />
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
  isSubscription = false,
}: {
  paymentMethod: string;
  accessToken: string | null;
  billingFields: Field[] | null;
  intentId: string;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  isSubscription?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidCardForm, setIsValidCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrency(state => state.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();
  const cardForm = useConfiguration(state => state.cardForm);
  const moneyHash = useMoneyHash();

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

    let apiMethod;

    if (paymentMethod === 'CARD') {
      apiMethod = moneyHash.cardForm
        .collect()
        .then(cardData => {
          logJSON.response('cardForm.collect', cardData);
          return cardData;
        })
        .catch(error => {
          logJSON.error('cardForm.collect', error);
          return Promise.reject(error);
        })
        .then(cardData =>
          moneyHash.cardForm.pay({
            cardData,
            intentId,
            billingData: getBillingValues(),
          }),
        )
        .then(response => {
          logJSON.response('cardForm.pay', response);
          return response;
        })
        .catch(error => {
          logJSON.error('cardForm.pay', error);
          return Promise.reject(error);
        });
    } else {
      apiMethod = moneyHash
        .submitForm({
          paymentMethod: paymentMethod as PaymentMethodSlugs,
          intentId,
          billingData: getBillingValues(),
        })
        .then(response => {
          logJSON.response('submitForm', response);
          return response;
        })
        .catch(error => {
          logJSON.error('submitForm', error);
          return Promise.reject(error);
        });
    }

    apiMethod
      .then(intentDetails => {
        const { stateDetails } = intentDetails;
        if (
          // Skip rendering the redirection loader and redirect directly
          // You can use paymentStatus.status === 'CAPTURED' if you're not using redirection on intent creation
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
    <CardFormProvider
      key={`${theme}-${i18n.language}`}
      onValidityChange={setIsValidCardForm}
    >
      <div className="p-4 space-y-4">
        {billingFields && (
          <DynamicFields
            title={t('payment.billingDetails')}
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
            {isSubscription ? (
              t('payment.subscribe')
            ) : (
              <>
                {t('payment.pay')}{' '}
                {formatCurrency({
                  currency,
                  amount: totalPrice,
                })}
              </>
            )}
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
        render={({ field: rhfField, fieldState }) => (
          <PhoneInput
            {...rhfField}
            label={field.label}
            isError={!!fieldState.error}
          />
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

export function Click2PayCardForm({
  onIntentDetailsChange,
  click2payNativeData,
  userInfo,
  createClick2PayIntent,
}: {
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  click2payNativeData: Record<string, any>;
  userInfo: InfoFormValues;
  createClick2PayIntent: (methodId: string) => Promise<string>;
}) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [maskedCards, setMaskedCards] = useState<MaskedCard[] | null>(null);
  const [scenario, setScenario] = useState<'VERIFY_USER' | 'NEW_EMAIL' | null>(
    null,
  );
  const [payWith, setPayWith] = useState<
    (MaskedCard['srcDigitalCardId'] & {}) | 'NEW_CARD' | null
  >(null);
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidCardForm, setIsValidCardForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrency(state => state.currency);
  const totalPrice = useTotalPrice();
  const { theme } = useTheme();
  const cardForm = useConfiguration(state => state.cardForm);
  const moneyHash = useMoneyHash();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    let apiMethod;

    if (payWith === 'NEW_CARD' && !checkoutAsGuest) {
      const intentId = await createClick2PayIntent(
        payWith === 'NEW_CARD' && !checkoutAsGuest ? 'CARD' : 'CLICK2PAY',
      );

      apiMethod = moneyHash.cardForm
        .collect()
        .then(cardData => {
          logJSON.response('cardForm.collect', cardData);
          return cardData;
        })
        .catch(error => {
          logJSON.error('cardForm.collect', error);
          return Promise.reject(error);
        })
        .then(cardData =>
          moneyHash.cardForm.pay({
            cardData,
            intentId,
          }),
        )
        .then(response => {
          logJSON.response('cardForm.pay', response);
          return response;
        })
        .catch(error => {
          logJSON.error('cardForm.pay', error);
          return Promise.reject(error);
        });
    } else if (payWith === 'NEW_CARD' && checkoutAsGuest) {
      apiMethod = moneyHash.click2Pay
        .checkoutWithNewCard({
          consumer: {
            emailAddress: userInfo.email,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
          },
          dpaTransactionOptions: {
            transactionAmount: {
              transactionAmount: totalPrice,
              transactionCurrencyCode: currency,
            },
            authenticationPreferences: {
              payloadRequested: 'AUTHENTICATED',
            },
            paymentOptions: [
              {
                dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM',
              },
            ],
            acquirerData: [
              {
                cardBrand: 'mastercard',
                acquirerMerchantId: 'SRC3DS',
                acquirerBIN: '545301',
              },
              {
                cardBrand: 'visa',
                acquirerMerchantId: '33334444',
                acquirerBIN: '432104',
              },
            ],
          },
          rememberMe,
        })
        .then(async checkoutResponse => {
          if (checkoutResponse.checkoutActionCode !== 'COMPLETE') return;
          const intentId = await createClick2PayIntent(
            payWith === 'NEW_CARD' && !checkoutAsGuest ? 'CARD' : 'CLICK2PAY',
          );
          return moneyHash.click2Pay.pay({ intentId, checkoutResponse });
        });
    } else {
      apiMethod = moneyHash.click2Pay
        .checkoutWithCard({
          srcDigitalCardId: payWith!,
          rememberMe,
          dpaTransactionOptions: {
            transactionAmount: {
              transactionAmount: totalPrice,
              transactionCurrencyCode: currency,
            },
            paymentOptions: [
              {
                dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM',
              },
            ],
            acquirerData: [
              {
                cardBrand: 'mastercard',
                acquirerMerchantId: 'SRC3DS',
                acquirerBIN: '545301',
              },
              {
                cardBrand: 'visa',
                acquirerMerchantId: '33334444',
                acquirerBIN: '432104',
              },
            ],
          },
        })
        .then(async checkoutResponse => {
          if (checkoutResponse.checkoutActionCode !== 'COMPLETE') return;
          const intentId = await createClick2PayIntent(
            payWith === 'NEW_CARD' && !checkoutAsGuest ? 'CARD' : 'CLICK2PAY',
          );
          return moneyHash.click2Pay.pay({ intentId, checkoutResponse });
        });
    }

    apiMethod
      .then(intentDetails => {
        if (!intentDetails) {
          setIsSubmitting(false);
          return;
        }

        const { stateDetails } = intentDetails;
        if (
          // Skip rendering the redirection loader and redirect directly
          // You can use paymentStatus.status === 'CAPTURED' if you're not using redirection on intent creation
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

  const handleUnrecognizedUser = useCallbackRef(
    async ({
      email,
      onConsumerNotPreset,
    }: {
      email: string;
      onConsumerNotPreset: () => void;
    }) => {
      const { consumerPresent } = await moneyHash.click2Pay.lookUp({
        email,
      });

      if (consumerPresent) {
        setScenario('VERIFY_USER');
        moneyHash.click2Pay
          .authenticate({
            loadSupportedValidationChannels: true,
            notYouRequestedCallback: ({ close }) => {
              setScenario('NEW_EMAIL');
              close();
            },
          })
          .then(result => {
            if (result.action === 'AUTHENTICATED') {
              setMaskedCards(result.maskedCards);
              setScenario(null);
            }
          })
          .catch((error: any) => {
            setPayWith('NEW_CARD');
            setScenario(null);
            toast.error(error.message);
          });
      } else {
        onConsumerNotPreset();
      }
    },
  );

  useEffect(() => {
    async function initializeC2P() {
      try {
        await moneyHash.click2Pay.init({
          env: 'sandbox',
          dpaLocale: 'en_US',
          srcDpaId: click2payNativeData.dpa_id,
          dpaData: {
            dpaName: click2payNativeData.dpa_name,
          },
          dpaTransactionOptions: {
            transactionAmount: {
              transactionAmount: totalPrice,
              transactionCurrencyCode: currency,
            },
            authenticationPreferences: {
              payloadRequested: 'AUTHENTICATED',
            },
            paymentOptions: [
              {
                dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_SHORT_FORM',
              },
            ],
            acquirerData: [
              {
                cardBrand: 'mastercard',
                acquirerMerchantId: 'SRC3DS',
                acquirerBIN: '545301',
              },
              {
                cardBrand: 'visa',
                acquirerMerchantId: '33334444',
                acquirerBIN: '432104',
              },
            ],
          },
          cardBrands: ['mastercard', 'visa', 'amex'],
        });

        const cards = await moneyHash.click2Pay.getCards();
        logJSON.response('click2Pay.getCards', cards);
        if (cards.length > 0) {
          setMaskedCards(cards);
        } else {
          handleUnrecognizedUser({
            email: userInfo.email,
            onConsumerNotPreset: () => setPayWith('NEW_CARD'),
          });
        }
      } catch (error: any) {
        setError(error.message);
      }
      setIsLoading(false);
    }

    initializeC2P();
  }, [
    moneyHash,
    click2payNativeData,
    userInfo.email,
    handleUnrecognizedUser,
    totalPrice,
    currency,
  ]);

  useEffect(() => {
    if (maskedCards?.length) {
      moneyHash.click2Pay.cardList.loadCards({ maskedCards });

      const selectSrcDigitalCardIdCleanup =
        moneyHash.click2Pay.cardList.addEventListener(
          'selectSrcDigitalCardId',
          e => {
            setPayWith(e.detail);
          },
        );

      const clickAddCardLinkCleanup =
        moneyHash.click2Pay.cardList.addEventListener('clickAddCardLink', () =>
          setPayWith('NEW_CARD'),
        );

      const clickSignOutLinkCleanup =
        moneyHash.click2Pay.cardList.addEventListener(
          'clickSignOutLink',
          async () => {
            await moneyHash.click2Pay.signOut();
            setMaskedCards(null);
            setScenario('NEW_EMAIL');
            setPayWith(null);
          },
        );

      return () => {
        selectSrcDigitalCardIdCleanup();
        clickAddCardLinkCleanup();
        clickSignOutLinkCleanup();
      };
    }
  }, [moneyHash, maskedCards]);

  useEffect(() => {
    if (payWith === 'NEW_CARD') {
      const controller = new AbortController();
      document
        .getElementById('mh-src-consent')
        ?.addEventListener(
          'checkoutAsGuest',
          (event: any) => setCheckoutAsGuest(event.detail.checkoutAsGuest),
          { signal: controller.signal },
        );

      document.getElementById('mh-src-consent')?.addEventListener(
        'rememberMe',
        (event: any) => {
          setRememberMe(event.detail.rememberMe);
        },
        { signal: controller.signal },
      );

      return () => {
        controller.abort();
      };
    }
  }, [payWith]);

  if (isLoading) {
    return <src-loader dark={theme === 'dark' ? true : undefined} />;
  }

  return (
    <div className="p-4 space-y-4">
      {maskedCards?.length ? (
        <src-card-list
          id="mh-src-card-list"
          background="transparent"
          dark={theme === 'dark' ? true : undefined}
          display-preferred-card
          display-sign-out
          display-header={false}
          card-selection-type="radioButton"
          display-add-card
          card-brands="mastercard,visa,amex"
        />
      ) : null}

      <src-otp-input
        id="mh-src-otp-input"
        card-brands="mastercard,visa,amex"
        style={{ display: 'none' }}
        dark={theme === 'dark' ? true : undefined}
      />

      {scenario === 'NEW_EMAIL' && (
        <NewEmailClick2PayCardForm
          onSubmit={async ({ email }) => {
            await handleUnrecognizedUser({
              email,
              onConsumerNotPreset: () =>
                toast.error(
                  'No email found in Click2Pay system. Please enter a different email.',
                ),
            });
          }}
        />
      )}

      {(scenario === 'VERIFY_USER' || scenario === 'NEW_EMAIL') && (
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-b" /> OR{' '}
            <div className="flex-1 border-t border-b" />
          </div>
          <button
            type="button"
            className="text-primary underline mt-4"
            onClick={() => {
              setPayWith('NEW_CARD');
              setScenario(null);
            }}
          >
            Enter card manually
          </button>
        </div>
      )}

      {payWith === 'NEW_CARD' && (
        <>
          <CardFormProvider
            key={`${theme}-${i18n.language}`}
            onValidityChange={setIsValidCardForm}
          >
            {cardForm === 'compact' ? (
              <CompactCardForm />
            ) : (
              <ExpandedCardForm />
            )}
          </CardFormProvider>

          <src-consent
            dark={theme === 'dark' ? true : undefined}
            display-remember-me={checkoutAsGuest}
            id="mh-src-consent"
          />
        </>
      )}

      {payWith && (
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={
            (payWith === 'NEW_CARD' && !isValidCardForm) || isSubmitting
          }
        >
          <>
            {t('payment.pay')}{' '}
            {formatCurrency({
              currency,
              amount: totalPrice,
            })}
          </>
        </Button>
      )}

      {error && <p className="text-sm text-center text-destructive">{error}</p>}
    </div>
  );
}

function NewEmailClick2PayCardForm({
  onSubmit,
}: {
  onSubmit: (data: { email: string }) => void;
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InfoFormValues>({
    mode: 'onTouched',
    resolver: valibotResolver(
      v.object({
        email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
      }),
    ),
    defaultValues: {
      email: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-center">
        Enter another email to access a different set of linked cards.
      </p>
      <Input
        id="email"
        label={t('checkout.contact.email')}
        {...register('email')}
        isError={!!errors?.email}
      />
      <Button
        type="submit"
        className="disabled:opacity-50 disabled:cursor-progress w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {t('checkout.continue')}
      </Button>
    </form>
  );
}
