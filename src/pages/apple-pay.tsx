import { useEffect, useState } from 'react';
import MoneyHash, { Method } from '@moneyhash/js-sdk/headless';
import toast from 'react-hot-toast';
import axios from 'axios';
import { JsonEditor } from '@/components/jsonEditor';
import NavBar from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectFloatingLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { logJSON } from '@/utils/logJSON';

type Env = 'production' | 'staging';

type FormConfiguration = {
  intentConfig: string;
  apiKey: string;
  env: Env;
  publicApiKey: string;
};

const defaultConfig = JSON.stringify(
  {
    amount: 50,
    amount_currency: 'usd',
    operation: 'purchase',
    billing_data: {
      first_name: 'Mustafa',
      last_name: 'eid',
      phone_number: '+201064610000',
      email: 'test@email.com',
    },
    webhook_url: 'https://webhook.site/b8954509-f628-4805-a4b4-58a0fb2be958',
  },
  null,
  2,
);

const defaultApiKey: Record<Env, string> = {
  production: 'NMyQeKCE.PE1ibNHTXepIxg0hyYrmU4LzK4sNdUS1',
  staging: 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H',
};

const defaultPublicApiKey: Record<Env, string> = {
  production: 'public.WsCZwBVz.mUyakj73ByciUGMOE1UYvGSFDJC7uu6ftLs4C5fy',
  staging: 'public.nFsXq2BS.rwzwRJAZaq8jEEPZcnMldOSFXIqklPOe9QXaOwW1',
};

const storedEnv =
  (localStorage.getItem('apple-pay-env') as Env) || 'production';
if (storedEnv === 'staging') {
  (window as any).MONEYHASH_IFRAME_URL = 'https://stg-embed.moneyhash.io';
  (window as any).API_URL = 'https://staging-web.moneyhash.io';
  (window as any).MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  (window as any).MONEYHASH_VAULT_API_URL =
    'https://vault-staging.moneyhash.io';
}

const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: defaultPublicApiKey.production,
});

export default function ApplePay() {
  const [config, setConfig] = useState<FormConfiguration>(() => ({
    intentConfig: defaultConfig,
    apiKey: defaultApiKey[storedEnv],
    env: storedEnv,
    publicApiKey: defaultPublicApiKey[storedEnv],
  }));
  const [nativePayData, setNativePayData] =
    useState<Method['nativePayData']>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { intentConfig } = config;
    setIsLoading(true);
    const intent = JSON.parse(intentConfig);

    logJSON.info('Configuration Used', { ...config, intentConfig: intent });

    moneyHash.setPublicApiKey(config.publicApiKey);
    moneyHash
      .getMethods({
        currency: intent.amount_currency,
        amount: intent.amount,
        operation: intent.operation,
        flowId: intent.flow_id,
        customer: intent.customer,
        customFields: intent.custom_fields,
      })
      .then(response => {
        const { expressMethods } = response;
        const applePay = expressMethods.find(m => m.id === 'APPLE_PAY');

        if (!applePay) {
          toast.error('Apple Pay is not available');
          logJSON.response('getMethods', response);
        } else {
          logJSON.response(
            'getMethods: ApplePay native data',
            applePay.nativePayData,
          );
          setNativePayData(applePay.nativePayData);
        }
      })
      .catch(e => {
        toast.error(`Error fetching methods | ${e.message}`);
        logJSON.error('getMethods', e);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [config]);

  return (
    <>
      <NavBar hideCart hideCurrency hideConfig />

      <section className=" mx-auto px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 max-w-screen-xl">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="flex flex-col gap-4">
            <AppleButton
              disabled={!nativePayData}
              className={isLoading ? 'animate-pulse' : ''}
              onClick={async () => {
                if (!nativePayData) return;

                let session: ApplePaySession;
                try {
                  session = new ApplePaySession(3, {
                    countryCode: nativePayData.country_code,
                    currencyCode: nativePayData.currency_code,
                    supportedNetworks: nativePayData.supported_networks,
                    merchantCapabilities: ['supports3DS'],
                    total: {
                      label: 'Apple Pay',
                      type: 'final',
                      amount: `${nativePayData.amount}`,
                    },
                    requiredShippingContactFields: ['email'],
                  });
                } catch (error) {
                  toast.error(
                    'Failed to create Apple Pay session, check logs.',
                  );
                  logJSON.error('Create ApplePay Session', error);
                  return;
                }

                session.onvalidatemerchant = e =>
                  moneyHash
                    .validateApplePayMerchantSession({
                      methodId: nativePayData.method_id,
                      validationUrl: e.validationURL,
                    })
                    .then(merchantSession =>
                      session.completeMerchantValidation(merchantSession),
                    )
                    .catch(e => {
                      session.abort();
                      toast.error(
                        'Failed to validate merchant session, check logs',
                      );
                      logJSON.error('Validate ApplePay Merchant Session', e);
                    });

                session.onpaymentauthorized = async e => {
                  const applePayReceipt = {
                    receipt: JSON.stringify({ token: e.payment.token }),
                    receiptBillingData: {
                      email: e.payment.shippingContact?.emailAddress,
                    },
                  };
                  session.completePayment(ApplePaySession.STATUS_SUCCESS);
                  logJSON.response('ApplePay Receipt', applePayReceipt);

                  let intentId;

                  try {
                    const baseUrl =
                      config.env === 'production'
                        ? 'https://web.moneyhash.io/api/v1.1'
                        : 'https://staging-web.moneyhash.io/api/v1.1';
                    intentId = await axios
                      .post(
                        `${baseUrl}/payments/intent/`,
                        JSON.parse(config.intentConfig),
                        {
                          headers: {
                            'x-api-key': config.apiKey,
                          },
                        },
                      )
                      .then(res => res.data.data.id);
                  } catch (error) {
                    toast.error('Failed to create intent, check logs');
                    logJSON.error('Create Intent', error);
                    return;
                  }

                  try {
                    await moneyHash.proceedWith({
                      type: 'method',
                      id: 'APPLE_PAY',
                      intentId,
                    });

                    const intentDetails = await moneyHash.submitPaymentReceipt({
                      nativeReceiptData: applePayReceipt,
                      intentId,
                    });
                    logJSON.response('Submit Receipt', intentDetails);
                    toast.success(
                      `Submitted receipt successfully, check logs.`,
                    );
                  } catch (error) {
                    toast.error('Failed to submit receipt, check logs');
                    logJSON.error('Submit Receipt', error);
                  }
                };

                session.begin();
              }}
            >
              Pay with Apple Pay
            </AppleButton>
            <AppleButton
              disabled={!nativePayData}
              className={isLoading ? 'animate-pulse' : ''}
              onClick={() => {
                if (!nativePayData) return;

                let session: ApplePaySession;
                try {
                  session = new ApplePaySession(3, {
                    countryCode: nativePayData.country_code,
                    currencyCode: nativePayData.currency_code,
                    supportedNetworks: nativePayData.supported_networks,
                    merchantCapabilities: ['supports3DS'],
                    total: {
                      label: 'Apple Pay',
                      type: 'final',
                      amount: `${nativePayData.amount}`,
                    },
                    requiredShippingContactFields: ['email'],
                  });
                } catch (error) {
                  toast.error(
                    'Failed to create Apple Pay session, check logs.',
                  );
                  logJSON.error('Create ApplePay Session', error);
                  return;
                }

                session.onvalidatemerchant = e =>
                  moneyHash
                    .validateApplePayMerchantSession({
                      methodId: nativePayData.method_id,
                      validationUrl: e.validationURL,
                    })
                    .then(merchantSession =>
                      session.completeMerchantValidation(merchantSession),
                    )
                    .catch(e => {
                      session.abort();
                      toast.error(
                        'Failed to validate merchant session, check logs',
                      );
                      logJSON.error('Validate ApplePay Merchant Session', e);
                    });

                session.onpaymentauthorized = e => {
                  const applePayReceipt = {
                    receipt: JSON.stringify({ token: e.payment.token }),
                    receiptBillingData: {
                      email: e.payment.shippingContact?.emailAddress,
                    },
                  };
                  session.completePayment(ApplePaySession.STATUS_SUCCESS);
                  logJSON.response('ApplePay Receipt', applePayReceipt);

                  moneyHash
                    .binLookupByReceipt({
                      nativeReceiptData: applePayReceipt,
                      methodId: nativePayData.method_id,
                      flowId: JSON.parse(config.intentConfig).flow_id,
                    })
                    .then(binLookup => {
                      logJSON.response('Bin Lookup', binLookup);
                      toast.success(`Bin Lookup Succeeded, check logs.`);
                    })
                    .catch(e => {
                      toast.error('Failed to lookup bin, check logs');
                      logJSON.error('Bin Lookup', e);
                    });
                };

                session.begin();
              }}
            >
              Bin Lookup
            </AppleButton>
          </div>

          <ConfigurationForm
            initialConfiguration={config}
            onUpdate={setConfig}
          />
        </div>
      </section>
    </>
  );
}

function ConfigurationForm({
  initialConfiguration,
  onUpdate,
}: {
  initialConfiguration: FormConfiguration;
  onUpdate: (options: FormConfiguration) => void;
}) {
  const [intentConfig, setIntentConfig] = useState(
    initialConfiguration.intentConfig,
  );
  const [apiKey, setApiKey] = useState(initialConfiguration.apiKey);
  const [publicApiKey, setPublicApiKey] = useState(
    initialConfiguration.publicApiKey,
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Account API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <Input
        label="Public Account API Key"
        value={publicApiKey}
        onChange={e => setPublicApiKey(e.target.value)}
      />
      <Select
        value={initialConfiguration.env}
        onValueChange={v => {
          localStorage.setItem('apple-pay-env', v);
          window.location.reload();
        }}
      >
        <SelectTrigger className="border border-input group relative focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/20">
          <SelectValue />
          <SelectFloatingLabel>Environment</SelectFloatingLabel>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="production">Production</SelectItem>
          <SelectItem value="staging">Staging</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Label className="text-xs">Intent Configuration</Label>
        <JsonEditor
          value={intentConfig}
          onChange={setIntentConfig}
          hideFooter
          className="min-h-[300px]"
        />
      </div>
      <Button
        onClick={() => {
          try {
            JSON.parse(intentConfig);
            onUpdate({
              intentConfig,
              apiKey,
              env: initialConfiguration.env,
              publicApiKey,
            });
          } catch (error) {
            toast.error('Invalid JSON format');
          }
        }}
      >
        Update
      </Button>
    </div>
  );
}

function AppleButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'text-white dark:bg-white dark:text-black bg-[#050708] hover:bg-[#050708]/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:hover:bg-[#fcfcfcdb] w-full flex items-center justify-center outline-none focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <svg
        className="ml-2 -mr-1 w-5 h-5"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="apple"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path
          fill="currentColor"
          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
        />
      </svg>
    </button>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="800px"
        height="800px"
        viewBox="0 -34.55 120.3 120.3"
        aria-hidden="true"
        className="w-20 h-20"
      >
        <path d="M22.8 6.6c1.4-1.8 2.4-4.2 2.1-6.6-2.1.1-4.6 1.4-6.1 3.1-1.3 1.5-2.5 4-2.2 6.3 2.4.3 4.7-1 6.2-2.8M24.9 10c-3.4-.2-6.3 1.9-7.9 1.9-1.6 0-4.1-1.8-6.8-1.8-3.5.1-6.7 2-8.5 5.2-3.6 6.3-1 15.6 2.6 20.7 1.7 2.5 3.8 5.3 6.5 5.2 2.6-.1 3.6-1.7 6.7-1.7s4 1.7 6.8 1.6 4.6-2.5 6.3-5.1c2-2.9 2.8-5.7 2.8-5.8-.1-.1-5.5-2.1-5.5-8.3-.1-5.2 4.2-7.7 4.4-7.8-2.3-3.6-6.1-4-7.4-4.1" />

        <g>
          <path d="M54.3 2.9c7.4 0 12.5 5.1 12.5 12.4 0 7.4-5.2 12.5-12.7 12.5H46v12.9h-5.9V2.9h14.2zm-8.3 20h6.7c5.1 0 8-2.8 8-7.5 0-4.8-2.9-7.5-8-7.5h-6.8v15h.1zM68.3 33c0-4.8 3.7-7.8 10.3-8.2l7.6-.4v-2.1c0-3.1-2.1-4.9-5.5-4.9-3.3 0-5.3 1.6-5.8 4h-5.4c.3-5 4.6-8.7 11.4-8.7 6.7 0 11 3.5 11 9.1v19h-5.4v-4.5h-.1c-1.6 3.1-5.1 5-8.7 5-5.6 0-9.4-3.4-9.4-8.3zm17.9-2.5v-2.2l-6.8.4c-3.4.2-5.3 1.7-5.3 4.1 0 2.4 2 4 5 4 4 0 7.1-2.7 7.1-6.3zM96.9 51v-4.6c.4.1 1.4.1 1.8.1 2.6 0 4-1.1 4.9-3.9 0-.1.5-1.7.5-1.7l-10-27.6h6.1l7 22.5h.1l7-22.5h6L110 42.4c-2.4 6.7-5.1 8.8-10.8 8.8-.4-.1-1.8-.1-2.3-.2z" />
        </g>
      </svg>
      <h1 className="text-3xl font-semibold -mt-3">Interactive Demo</h1>
    </header>
  );
}
