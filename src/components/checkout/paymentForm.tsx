import { Fragment, useState } from 'react';
import { type IntentDetails, type Method } from '@moneyhash/js-sdk/headless';
import GooglePayButton from '@google-pay/button-react';

import { cn } from '@/utils/cn';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { IntentStateRenderer } from './intentStateRenderer';
import useConfiguration from '@/store/useConfiguration';

type PaymentFormProps = {
  methods: Method[];
  expressMethods?: Method[] | null;
  onSelectMethod: (methodId: string) => Promise<void>;
  onApplePayClick: (options: {
    onCancel: () => void;
    onError: () => void;
  }) => void;
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
  onSelectMethod,
  onApplePayClick,
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
    <>
      {hasExpressMethods && (
        <div className="grid grid-cols-1 gap-3 p-4 pt-8 relative border rounded mb-8">
          <p className="text-sm absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder">
            Express checkout
          </p>
          {expressMethods?.map(method => (
            <ExpressButton
              key={method.id}
              method={method}
              isSelected={false}
              onClick={async () => {
                if (method.id === 'APPLE_PAY') {
                  setIsSelectingMethod(method.id);
                  onApplePayClick({
                    onCancel: () => setIsSelectingMethod(null),
                    onError: () => setIsSelectingMethod(null),
                  });
                } else {
                  handleMethodSelection(method.id);
                }
              }}
            />
          ))}
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
            />
          </div>
        )}
      </div>
    </>
  );
}

function AccordionPaymentForm({
  intentDetails,
  methods,
  expressMethods,
  onApplePayClick,
  onIntentDetailsChange,
  onSelectMethod,
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
                  isSelected={false}
                  onClick={async () => {
                    if (method.id === 'APPLE_PAY') {
                      setIsSelectingMethod(method.id);
                      onApplePayClick({
                        onCancel: () => setIsSelectingMethod(null),
                        onError: () => setIsSelectingMethod(null),
                      });
                    } else {
                      handleMethodSelection(method.id);
                    }
                  }}
                />
                {intentDetails?.selectedMethod === method.id && (
                  <IntentStateRenderer
                    intentId={intentDetails.intent.id}
                    state={intentDetails.state}
                    stateDetails={intentDetails.stateDetails}
                    onIntentDetailsChange={onIntentDetailsChange}
                    paymentMethod={intentDetails.selectedMethod}
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
  onClick,
}: {
  isSelected: boolean;
  method: Method;
  onClick: () => void;
}) {
  if (method.id === 'GOOGLE_PAY') {
    return (
      <GooglePayButton
        environment="TEST"
        buttonType="pay"
        buttonColor="black"
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
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Emirates Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '100.00',
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        buttonSizeMode="fill"
        style={{ height: 40 }}
        className={cn(
          '[&_.gpay-card-info-container]:!outline-none [&_.gpay-card-info-container]:!rounded-sm',
          isSelected &&
            '[&_.gpay-card-info-container]:!border-indigo-500 [&_.gpay-card-info-container]:!ring-2 [&_.gpay-card-info-container]:!ring-indigo-500 [&_.gpay-card-info-container]:!outline-none ',
        )}
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
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
      onClick={onClick}
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
