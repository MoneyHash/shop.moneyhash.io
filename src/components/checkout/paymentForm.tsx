import { Fragment, useState } from 'react';
import {
  type NativeReceiptData,
  type Card,
  type IntentDetails,
  type Method,
} from '@moneyhash/js-sdk/headless';
import GooglePayButton from '@google-pay/button-react';

import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { IntentStateRenderer } from './intentStateRenderer';
import useConfiguration from '@/store/useConfiguration';
import { SavedCards } from './savedCards';
import { logJSON } from '@/utils/logJSON';

type PaymentFormProps = {
  methods: Method[];
  expressMethods?: Method[] | null;
  savedCards: Card[] | null;
  googlePayNativeData: Record<string, any> | null;
  onSelectMethod: (methodId: string) => Promise<any>;
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
  onApplePayClick,
  onPayWithSavedCard,
  onGooglePayClick,
  onIntentDetailsChange,
}: PaymentFormProps) {
  const [isSelectingMethod, setIsSelectingMethod] = useState<string | null>(
    null,
  );

  const handleMethodSelection = (methodId: string) => {
    if (isSelectingMethod) return;
    setIsSelectingMethod(methodId);
    onSelectMethod(methodId).finally(() => setIsSelectingMethod(null));
  };

  const hasExpressMethods = !!expressMethods?.length;

  return (
    <div className="space-y-8">
      {hasExpressMethods && (
        <div className="grid grid-cols-1 gap-3 p-4 pt-8 relative border rounded">
          <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder">
            Express checkout
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
                  toast.error(
                    'Failed to process Google Pay payment. Please try again. Check console for details.',
                  );
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
            Saved Cards
          </p>
          <div>
            <SavedCards cards={savedCards} onPay={onPayWithSavedCard} />
          </div>
        </div>
      )}

      <div className="relative border rounded p-4 pt-8">
        <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder capitalize">
          {hasExpressMethods && 'or'} pay with
        </p>
        <RadioGroup
          className="overflow-x-auto space-x-4 flex py-4 -my-4 px-0.5 -mx-0.5"
          value={intentDetails?.selectedMethod || ''}
          onValueChange={handleMethodSelection}
        >
          {methods.map(method => (
            <div key={method.id}>
              <RadioGroupItem
                id={method.id}
                value={method.id}
                className="sr-only peer"
                disabled={!!isSelectingMethod}
              />
              <label
                htmlFor={method.id}
                className={cn(
                  'p-4 flex flex-shrink-0 flex-col gap-2 border border-input rounded-lg cursor-pointer w-44',
                  intentDetails?.selectedMethod === method.id
                    ? 'text-bolder border-ring ring-2 ring-ring/30 bg-primary/5'
                    : 'text-subtle',
                  isSelectingMethod &&
                    method.id === isSelectingMethod &&
                    'animate-pulse',
                  isSelectingMethod &&
                    isSelectingMethod !== method.id &&
                    'cursor-not-allowed opacity-50',
                )}
              >
                <img
                  src={method.icons[0]}
                  alt=""
                  className="w-[34px] h-[24px] object-contain"
                />
                <span className="font-medium">{method.title}</span>
              </label>
            </div>
          ))}
        </RadioGroup>
        {intentDetails?.selectedMethod && (
          <div className="pt-4 -m-4">
            <IntentStateRenderer
              intentId={intentDetails?.intent.id}
              state={intentDetails?.state}
              stateDetails={intentDetails?.stateDetails}
              onIntentDetailsChange={onIntentDetailsChange}
              paymentMethod={intentDetails?.selectedMethod}
              paymentStatus={intentDetails.paymentStatus}
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
  onPayWithSavedCard,
  onGooglePayClick,
}: PaymentFormProps) {
  const [isSelectingMethod, setIsSelectingMethod] = useState<string | null>(
    null,
  );

  const handleMethodSelection = (methodId: string) => {
    if (isSelectingMethod) return;
    setIsSelectingMethod(methodId);
    onSelectMethod(methodId).finally(() => setIsSelectingMethod(null));
  };

  return (
    <>
      {!!expressMethods?.length && (
        <div className="mb-8">
          <p className="text-sm text-center font-medium">Express checkout</p>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {expressMethods.map(method => (
              <Fragment key={method.id}>
                <ExpressButton
                  key={method.id}
                  method={method}
                  googlePayNativeData={googlePayNativeData}
                  isSelected={false}
                  onApplePayClick={async () => {
                    setIsSelectingMethod(method.id);
                    onApplePayClick({
                      onCancel: () => setIsSelectingMethod(null),
                      onError: () => setIsSelectingMethod(null),
                    });
                  }}
                  onPayWithGooglePay={googlePayReceipt => {
                    setIsSelectingMethod(method.id);
                    onGooglePayClick(googlePayReceipt).catch(e => {
                      toast.error(
                        'Failed to process Google Pay payment. Please try again. Check console for details.',
                      );
                      logJSON.error('Google Pay Error', e);
                      setIsSelectingMethod(null);
                    });
                  }}
                  onCancelGooglePay={() => setIsSelectingMethod(null)}
                />
                {intentDetails?.selectedMethod === method.id && (
                  <IntentStateRenderer
                    intentId={intentDetails.intent.id}
                    state={intentDetails.state}
                    stateDetails={intentDetails.stateDetails}
                    onIntentDetailsChange={onIntentDetailsChange}
                    paymentMethod={intentDetails.selectedMethod}
                    paymentStatus={intentDetails.paymentStatus}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
      <div>
        <h2 className="font-medium">Payment</h2>
        <p className="text-subtler text-sm">
          All transactions are secure and encrypted.
        </p>
      </div>

      {savedCards && savedCards?.length > 0 && (
        <div className="mt-4">
          <SavedCards cards={savedCards} onPay={onPayWithSavedCard} />
        </div>
      )}

      <RadioGroup
        className="gap-0 border border-input rounded-md divide-y divide-input mt-2"
        value={intentDetails?.selectedMethod || ''}
        onValueChange={handleMethodSelection}
      >
        {methods.map(method => (
          <Fragment key={method.id}>
            <label
              htmlFor={method.id}
              className={cn(
                'p-4 flex items-center gap-4 cursor-pointer has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed',
                isSelectingMethod &&
                  method.id === isSelectingMethod &&
                  'animate-pulse',
              )}
            >
              <RadioGroupItem
                id={method.id}
                value={method.id}
                disabled={
                  !!(isSelectingMethod && isSelectingMethod !== method.id)
                }
              />
              <div className="text-bolder flex items-center gap-3">
                <img
                  src={method.icons[0]}
                  alt=""
                  className="w-[34px] h-[24px] object-contain"
                />
                <span>{method.title}</span>
              </div>
            </label>
            {intentDetails?.selectedMethod === method.id && (
              <IntentStateRenderer
                intentId={intentDetails.intent.id}
                state={intentDetails.state}
                stateDetails={intentDetails.stateDetails}
                onIntentDetailsChange={onIntentDetailsChange}
                paymentMethod={intentDetails.selectedMethod}
                paymentStatus={intentDetails.paymentStatus}
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
  if (googlePayNativeData && method.id === 'GOOGLE_PAY') {
    return (
      <GooglePayButton
        environment="TEST"
        buttonColor="white"
        buttonSizeMode="fill"
        buttonType="pay"
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
          Pay with <span className="font-medium">{method.title}</span>
        </p>
      )}
    </button>
  );
}
