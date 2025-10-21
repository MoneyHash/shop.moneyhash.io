import { Fragment, useState } from 'react';
import {
  type NativeReceiptData,
  type Card,
  type IntentDetails,
  type Method,
} from '@moneyhash/js-sdk/headless';
import GooglePayButton from '@google-pay/button-react';
import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { IntentStateRenderer } from './intentStateRenderer';
import useConfiguration from '@/store/useConfiguration';
import { SavedCards } from './savedCards';
import { logJSON } from '@/utils/logJSON';
import { BankIcon } from '../icons/bankIcon';
import { translatePaymentMethod } from '@/utils/translatePaymentMethod';
import { useTheme } from '@/context/themeProvider';
import { type InfoFormValues } from './infoForm';

type PaymentFormProps = {
  methods: Method[];
  expressMethods?: Method[] | null;
  savedCards: Card[] | null;
  googlePayNativeData: Record<string, any> | null;
  onSelectMethod: (methodId: string) => Promise<any>;
  onSelectBankInstallment: () => Promise<any>;
  createClick2PayIntent?: (methodId: string) => Promise<string>;
  onPayWithSavedCard: (options: {
    cardId: string;
    cvv: string;
  }) => Promise<any>;
  onApplePayClick: (options: {
    onCancel: () => void;
    onError: () => void;
  }) => void;
  onGooglePayClick: (googlePayReceipt: NativeReceiptData) => Promise<void>;
  intentDetails?: IntentDetails<'payment'> | null;
  onIntentDetailsChange: (intentDetails: IntentDetails<'payment'>) => void;
  userInfo?: InfoFormValues;
};

export function PaymentForm(props: PaymentFormProps) {
  const { layout } = useConfiguration();
  if (layout === 'accordion') return <AccordionPaymentForm {...props} />;
  return <TabsPaymentForm {...props} />;
}

function TabsPaymentForm({
  intentDetails,
  methods,
  expressMethods,
  savedCards,
  googlePayNativeData,
  onSelectMethod,
  onSelectBankInstallment,
  onApplePayClick,
  onPayWithSavedCard,
  onGooglePayClick,
  onIntentDetailsChange,
  userInfo,
  createClick2PayIntent,
}: PaymentFormProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [isSelectingMethod, setIsSelectingMethod] = useState<string | null>(
    null,
  );

  const handleMethodSelection = (methodId: string) => {
    if (isSelectingMethod && isSelectingMethod !== 'BANK_INSTALLMENT') return;

    setIsSelectingMethod(methodId);
    onSelectMethod(methodId).finally(() => setIsSelectingMethod(null));
  };

  const handleBankInstallmentSelection = () => {
    if (isSelectingMethod) return;
    setIsSelectingMethod('BANK_INSTALLMENT');
    onSelectBankInstallment();
  };

  const hasExpressMethods = !!expressMethods?.length;

  // Separate methods into priority order: CARD, then others, maintaining sorted order
  const cardMethod = methods.find(m => m.id === 'CARD');
  const fawryMethod = methods.find(m => m.id === 'PAY_AT_FAWRY');
  const cashOnDeliveryMethod = methods.find(m => m.id === 'CASH_ON_DELIVERY');
  const otherMethods = methods.filter(
    m =>
      m.id !== 'CARD' && m.id !== 'PAY_AT_FAWRY' && m.id !== 'CASH_ON_DELIVERY',
  );

  return (
    <div className="space-y-8">
      {hasExpressMethods && (
        <div className="grid grid-cols-1 gap-3 p-4 pt-8 relative border rounded">
          <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder">
            {t('payment.expressCheckout')}
          </p>
          {expressMethods?.map(method => (
            <ExpressButton
              key={method.id}
              method={method}
              googlePayNativeData={googlePayNativeData}
              isSelected={false}
              onApplePayClick={() => {
                setIsSelectingMethod(method.id);
                onApplePayClick({
                  onCancel: () => setIsSelectingMethod(null),
                  onError: () => setIsSelectingMethod(null),
                });
              }}
              onPayWithGooglePay={googlePayReceipt => {
                setIsSelectingMethod(method.id);
                onGooglePayClick(googlePayReceipt).catch(e => {
                  toast.error(t('errors.googlePayFailed'));
                  logJSON.error('Google Pay Error', e);
                  setIsSelectingMethod(null);
                });
              }}
              onCancelGooglePay={() => setIsSelectingMethod(null)}
            />
          ))}
        </div>
      )}

      {savedCards && savedCards?.length > 0 && (
        <div className="relative border rounded p-4 pt-8">
          <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder capitalize">
            {t('payment.savedCards')}
          </p>
          <div>
            <SavedCards cards={savedCards} onPay={onPayWithSavedCard} />
          </div>
        </div>
      )}

      <div className="relative border rounded p-4 pt-8">
        <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder capitalize">
          {hasExpressMethods ? t('payment.orPayWith') : t('payment.payWith')}
        </p>
        <RadioGroup
          dir={dir}
          className="overflow-x-auto space-x-4 flex py-4 -my-4 px-0.5 -mx-0.5"
          value={
            isSelectingMethod === 'BANK_INSTALLMENT'
              ? 'BANK_INSTALLMENT'
              : intentDetails?.selectedMethod || ''
          }
          onValueChange={method => {
            if (method === 'BANK_INSTALLMENT') {
              handleBankInstallmentSelection();
            } else {
              handleMethodSelection(method);
            }
          }}
        >
          {/* Render CARD first */}
          {cardMethod && (
            <div key={cardMethod.id}>
              <RadioGroupItem
                dir={dir}
                id={cardMethod.id}
                value={cardMethod.id}
                className="sr-only peer"
                disabled={
                  isSelectingMethod === 'BANK_INSTALLMENT'
                    ? false
                    : !!isSelectingMethod
                }
              />
              <label
                htmlFor={cardMethod.id}
                className={cn(
                  'p-4 flex flex-shrink-0 flex-col gap-2 border border-input rounded-lg cursor-pointer w-44 text-subtle',
                  'peer-aria-checked::text-bolder peer-aria-checked:border-ring peer-aria-checked:ring-2 peer-aria-checked:ring-ring/30 peer-aria-checked:bg-primary/5',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                  isSelectingMethod &&
                    cardMethod.id === isSelectingMethod &&
                    'animate-pulse',
                )}
              >
                <img
                  src={cardMethod.icons[0]}
                  alt=""
                  className="w-[34px] h-[24px] object-contain"
                />
                <span className="font-medium">
                  {translatePaymentMethod(cardMethod.title, t)}
                </span>
              </label>
            </div>
          )}

          {/* Render BANK_INSTALLMENT second */}
          <div>
            <RadioGroupItem
              dir={dir}
              id="BANK_INSTALLMENT"
              value="BANK_INSTALLMENT"
              className="sr-only peer"
              disabled={!!isSelectingMethod}
            />
            <label
              htmlFor="BANK_INSTALLMENT"
              className={cn(
                'p-4 flex flex-shrink-0 flex-col gap-2 border border-input rounded-lg cursor-pointer w-44',
                isSelectingMethod === 'BANK_INSTALLMENT'
                  ? 'text-bolder border-ring ring-2 ring-ring/30 bg-primary/5'
                  : 'text-subtle',
                isSelectingMethod &&
                  isSelectingMethod === 'BANK_INSTALLMENT' &&
                  !intentDetails &&
                  'animate-pulse',
                isSelectingMethod &&
                  isSelectingMethod !== 'BANK_INSTALLMENT' &&
                  'cursor-not-allowed opacity-50',
              )}
            >
              <BankIcon className="w-[34px] h-[24px] text-foreground" />
              <span className="font-medium">
                {t('payment.bankInstallment')}
              </span>
            </label>
          </div>

          {/* Render remaining methods: PAY_AT_FAWRY, CASH_ON_DELIVERY, others */}
          {[fawryMethod, cashOnDeliveryMethod, ...otherMethods]
            .filter(Boolean)
            .map(method => (
              <div key={method!.id}>
                <RadioGroupItem
                  dir={dir}
                  id={method!.id}
                  value={method!.id}
                  className="sr-only peer"
                  disabled={
                    isSelectingMethod === 'BANK_INSTALLMENT'
                      ? false
                      : !!isSelectingMethod
                  }
                />
                <label
                  htmlFor={method!.id}
                  className={cn(
                    'p-4 flex flex-shrink-0 flex-col gap-2 border border-input rounded-lg cursor-pointer w-44 text-subtle',
                    'peer-aria-checked::text-bolder peer-aria-checked:border-ring peer-aria-checked:ring-2 peer-aria-checked:ring-ring/30 peer-aria-checked:bg-primary/5',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    isSelectingMethod &&
                      method!.id === isSelectingMethod &&
                      'animate-pulse',
                  )}
                >
                  <img
                    src={method!.icons[0]}
                    alt=""
                    className="w-[34px] h-[24px] object-contain"
                  />
                  <span className="font-medium">
                    {translatePaymentMethod(method!.title, t)}
                  </span>
                </label>
              </div>
            ))}
        </RadioGroup>
        {intentDetails?.selectedMethod && (
          <div className="pt-4 -m-4">
            <IntentStateRenderer
              onIntentDetailsChange={onIntentDetailsChange}
              paymentMethod={intentDetails?.selectedMethod}
              intentDetails={intentDetails}
              isInstallment={Boolean(isSelectingMethod === 'BANK_INSTALLMENT')}
              userInfo={userInfo}
              createClick2PayIntent={createClick2PayIntent}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function AccordionPaymentForm({
  intentDetails,
  methods,
  expressMethods,
  savedCards,
  googlePayNativeData,
  onApplePayClick,
  onIntentDetailsChange,
  onSelectMethod,
  onSelectBankInstallment,
  onPayWithSavedCard,
  onGooglePayClick,
  userInfo,
  createClick2PayIntent,
}: PaymentFormProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [isSelectingMethod, setIsSelectingMethod] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleMethodSelection = (methodId: string) => {
    setSelectedMethod(methodId);
    setIsSelectingMethod(true);
    onSelectMethod(methodId).finally(() => setIsSelectingMethod(false));
  };

  const handleBankInstallmentSelection = () => {
    // Custom FE only method
    setSelectedMethod('BANK_INSTALLMENT');
    setIsSelectingMethod(true);
    onSelectBankInstallment().finally(() => setIsSelectingMethod(false));
  };

  // Separate methods into priority order: CARD, then others, maintaining sorted order
  const cardMethod = methods.find(m => m.id === 'CARD');
  const fawryMethod = methods.find(m => m.id === 'PAY_AT_FAWRY');
  const cashOnDeliveryMethod = methods.find(m => m.id === 'CASH_ON_DELIVERY');
  const otherMethods = methods.filter(
    m =>
      m.id !== 'CARD' && m.id !== 'PAY_AT_FAWRY' && m.id !== 'CASH_ON_DELIVERY',
  );

  const click2payNativeData = expressMethods?.find(
    m => m.id === 'CLICK2PAY',
  )?.nativePayData;

  return (
    <>
      {!!expressMethods?.length && (
        <div className="mb-8">
          <p className="text-sm text-center font-medium">
            {t('payment.expressCheckout')}
          </p>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {expressMethods.map(method => (
              <Fragment key={method.id}>
                <ExpressButton
                  key={method.id}
                  method={method}
                  googlePayNativeData={googlePayNativeData}
                  isSelected={false}
                  onApplePayClick={async () => {
                    setIsSelectingMethod(true);
                    onApplePayClick({
                      onCancel: () => setIsSelectingMethod(false),
                      onError: () => setIsSelectingMethod(false),
                    });
                  }}
                  onPayWithGooglePay={googlePayReceipt => {
                    setIsSelectingMethod(true);
                    onGooglePayClick(googlePayReceipt).catch(e => {
                      toast.error(t('errors.googlePayFailed'));
                      logJSON.error('Google Pay Error', e);
                      setIsSelectingMethod(false);
                    });
                  }}
                  onCancelGooglePay={() => setIsSelectingMethod(false)}
                />
                {!isSelectingMethod &&
                  intentDetails?.selectedMethod === method.id && (
                    <IntentStateRenderer
                      onIntentDetailsChange={onIntentDetailsChange}
                      intentDetails={intentDetails}
                      paymentMethod={intentDetails.selectedMethod}
                    />
                  )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
      <div>
        <h2 className="font-medium">{t('payment.title')}</h2>
        <p className="text-subtler text-sm">{t('payment.secureMessage')}</p>
      </div>

      {savedCards && savedCards?.length > 0 && (
        <div className="mt-4">
          <SavedCards cards={savedCards} onPay={onPayWithSavedCard} />
        </div>
      )}

      <RadioGroup
        dir={dir}
        className="gap-0 border border-input rounded-md divide-y divide-input mt-2"
        value={selectedMethod || ''}
        onValueChange={method => {
          if (method === 'C2P-CARD') {
            setSelectedMethod(method);
          } else if (method === 'BANK_INSTALLMENT') {
            handleBankInstallmentSelection();
          } else {
            handleMethodSelection(method);
          }
        }}
        disabled={isSelectingMethod}
      >
        {/* Render CARD first */}
        {cardMethod && (
          <Fragment key={cardMethod.id}>
            <label
              htmlFor={cardMethod.id}
              className={cn(
                'p-4 flex items-center gap-4 cursor-pointer has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed',
                isSelectingMethod &&
                  cardMethod.id === selectedMethod &&
                  'animate-pulse',
              )}
            >
              <RadioGroupItem
                dir={dir}
                id={cardMethod.id}
                value={click2payNativeData ? 'C2P-CARD' : cardMethod.id} // C2P-CARD custom method FE only, handle C2P & CARD together
              />
              <div className="text-bolder flex items-center gap-3 flex-1">
                {click2payNativeData ? (
                  <>
                    <img
                      src={
                        theme === 'dark'
                          ? '/images/c2p-dark.svg'
                          : '/images/c2p-light.svg'
                      }
                      alt=""
                      className="h-[24px] origin-left scale-125"
                    />
                    <span>Credit/Debit</span>
                    <div className="ml-auto">
                      <src-mark
                        dark={theme === 'dark'}
                        card-brands="mastercard,visa,amex"
                        height={32}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={cardMethod.icons[0]}
                      alt=""
                      className="w-[34px] h-[24px] object-contain"
                    />
                    <span>{translatePaymentMethod(cardMethod.title, t)}</span>
                  </>
                )}
              </div>
            </label>
            {!isSelectingMethod &&
              selectedMethod ===
                (click2payNativeData ? 'C2P-CARD' : cardMethod.id) && (
                <IntentStateRenderer
                  intentDetails={intentDetails}
                  onIntentDetailsChange={onIntentDetailsChange}
                  click2payNativeData={click2payNativeData}
                  userInfo={userInfo}
                  paymentMethod={selectedMethod}
                  createClick2PayIntent={createClick2PayIntent}
                />
              )}
          </Fragment>
        )}

        {/* Render BANK_INSTALLMENT second */}
        <>
          <label
            htmlFor="BANK_INSTALLMENT"
            className="p-4 flex items-center gap-4 cursor-pointer has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed"
          >
            <RadioGroupItem
              dir={dir}
              id="BANK_INSTALLMENT"
              value="BANK_INSTALLMENT"
            />
            <div className="text-bolder flex items-center gap-3">
              <BankIcon className="w-[34px] h-[24px] text-foreground" />
              <span>{t('payment.bankInstallment')}</span>
            </div>
          </label>
          {!isSelectingMethod &&
            intentDetails &&
            selectedMethod === 'BANK_INSTALLMENT' && (
              <IntentStateRenderer
                intentDetails={intentDetails}
                onIntentDetailsChange={onIntentDetailsChange}
                paymentMethod={selectedMethod}
                isInstallment
              />
            )}
        </>

        {/* Render remaining methods: PAY_AT_FAWRY, CASH_ON_DELIVERY, others */}
        {[fawryMethod, cashOnDeliveryMethod, ...otherMethods]
          .filter(Boolean)
          .map(method => (
            <Fragment key={method!.id}>
              <label
                htmlFor={method!.id}
                className={cn(
                  'p-4 flex items-center gap-4 cursor-pointer has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed',
                  isSelectingMethod &&
                    method!.id === selectedMethod &&
                    'animate-pulse',
                )}
              >
                <RadioGroupItem dir={dir} id={method!.id} value={method!.id} />
                <div className="text-bolder flex items-center gap-3">
                  <img
                    src={method!.icons[0]}
                    alt=""
                    className="w-[34px] h-[24px] object-contain"
                  />
                  <span>{translatePaymentMethod(method!.title, t)}</span>
                </div>
              </label>
              {!isSelectingMethod && selectedMethod === method!.id && (
                <IntentStateRenderer
                  intentDetails={intentDetails}
                  onIntentDetailsChange={onIntentDetailsChange}
                  paymentMethod={selectedMethod}
                />
              )}
            </Fragment>
          ))}
      </RadioGroup>
    </>
  );
}

function ExpressButton({
  isSelected,
  method,
  onApplePayClick,
  googlePayNativeData,
  onPayWithGooglePay,
  onCancelGooglePay,
}: {
  isSelected: boolean;
  method: Method;
  onApplePayClick: () => void;
  googlePayNativeData: Record<string, any> | null;
  onPayWithGooglePay: (googlePayReceipt: NativeReceiptData) => void;
  onCancelGooglePay: () => void;
}) {
  const { t, i18n } = useTranslation();
  if (googlePayNativeData && method.id === 'GOOGLE_PAY') {
    return (
      <GooglePayButton
        environment="TEST"
        buttonColor="white"
        buttonSizeMode="fill"
        buttonType="pay"
        buttonLocale={i18n.language}
        buttonRadius={4}
        className="[&_#gpay-button-online-api-id]:block [&_#gpay-button-online-api-id]:outline-none [&_#gpay-button-online-api-id]:border [&_#gpay-button-online-api-id]:border-input [&_#gpay-button-online-api-id]:border-solid"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: googlePayNativeData.gateway,
                  gatewayMerchantId: googlePayNativeData.gateway_merchant_id,
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: googlePayNativeData.merchant_id,
            merchantName: googlePayNativeData.merchant_name,
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: `${googlePayNativeData.amount}`,
            currencyCode: googlePayNativeData.currency_code,
            countryCode: googlePayNativeData.country_code || 'US',
          },
          emailRequired: true,
        }}
        onLoadPaymentData={paymentRequest => {
          const { paymentMethodData, email } = paymentRequest;
          const paymentToken = paymentMethodData.tokenizationData.token;
          const googlePayReceipt = {
            receipt: paymentToken,
            receiptBillingData: {
              email,
            },
          };
          logJSON.info('GooglePay Receipt', googlePayReceipt);
          onPayWithGooglePay(googlePayReceipt);
        }}
        onCancel={onCancelGooglePay}
      />
    );
  }

  if (method.id === 'APPLE_PAY') {
    return (
      <button
        type="button"
        className={cn(
          'flex justify-center items-center rounded-sm hover:opacity-90 border border-input h-[40px] py-1 focus:outline-none focus-visible:ring-2 focus-visible:border-ring focus-visible:ring-ring/30 overflow-hidden bg-white',
          isSelected && 'border-ring ring-2 ring-ring/30 bg-primary/5',
        )}
        onClick={onApplePayClick}
      >
        {method.id === 'APPLE_PAY' ? (
          <img
            src={method.icons[0]}
            alt=""
            className="h-full filter-invert"
            draggable={false}
          />
        ) : (
          <p>
            Pay with{' '}
            <span className="font-medium">
              {translatePaymentMethod(method.title, t)}
            </span>
          </p>
        )}
      </button>
    );
  }

  return null;
}
