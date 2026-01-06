import { useEffect, useState } from 'react';
import MoneyHash, { Method } from '@moneyhash/js-sdk/headless';
import toast from 'react-hot-toast';
import GooglePayButton from '@google-pay/button-react';
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

type Env = 'production' | 'staging' | 'preprod';

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
  preprod: 'wocSeGMI.e3l92r5b9NYXVgTLfBXvED88oppdsi3H',
};

const defaultPublicApiKey: Record<Env, string> = {
  production: 'public.WsCZwBVz.mUyakj73ByciUGMOE1UYvGSFDJC7uu6ftLs4C5fy',
  staging: 'public.nFsXq2BS.rwzwRJAZaq8jEEPZcnMldOSFXIqklPOe9QXaOwW1',
  preprod: 'public.nFsXq2BS.rwzwRJAZaq8jEEPZcnMldOSFXIqklPOe9QXaOwW1',
};

const storedEnv =
  (localStorage.getItem('google-pay-env') as Env) || 'production';
if (storedEnv === 'staging') {
  window.MONEYHASH_IFRAME_URL = 'https://stg-embed.moneyhash.io';
  window.API_URL = 'https://staging-web.moneyhash.io';
  window.MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  window.MONEYHASH_VAULT_API_URL = 'https://vault-staging.moneyhash.io';
} else if (storedEnv === 'preprod') {
  window.MONEYHASH_IFRAME_URL = 'https://preprod-embed.moneyhash.io';
  window.API_URL = 'https://preprod-web.moneyhash.io';
  window.MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  window.MONEYHASH_VAULT_API_URL = 'https://vault-staging.moneyhash.io';
}

const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: defaultPublicApiKey.production,
});

export default function GooglePay() {
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
        const googlePay = expressMethods.find(m => m.id === 'GOOGLE_PAY');

        if (!googlePay) {
          toast.error('Google Pay is not available');
          logJSON.response('getMethods', response);
        } else {
          logJSON.response(
            'getMethods: Google Pay native data',
            googlePay.nativePayData,
          );
          setNativePayData(googlePay.nativePayData);
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
          <div
            className={cn(
              'flex flex-col gap-4',
              isLoading && 'opacity-50 animate-pulse',
            )}
          >
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
                      allowedAuthMethods:
                        nativePayData?.allowed_card_auth_methods,
                      allowedCardNetworks: nativePayData?.allowed_card_networks,
                    },
                    tokenizationSpecification: {
                      type: 'PAYMENT_GATEWAY',
                      parameters: {
                        gateway: nativePayData?.gateway,
                        gatewayMerchantId: nativePayData?.gateway_merchant_id,
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: nativePayData?.merchant_id,
                  merchantName: nativePayData?.merchant_name,
                },
                transactionInfo: {
                  totalPriceStatus: 'FINAL',
                  totalPriceLabel: 'Total',
                  totalPrice: `${nativePayData?.amount}`,
                  currencyCode: nativePayData?.currency_code,
                  countryCode: nativePayData?.country_code || 'US',
                },
                emailRequired: true,
              }}
              onLoadPaymentData={async paymentRequest => {
                setIsLoading(true);
                const { paymentMethodData, email } = paymentRequest;
                const paymentToken = paymentMethodData.tokenizationData.token;
                const googlePayReceipt = {
                  receipt: paymentToken,
                  receiptBillingData: {
                    email,
                  },
                };
                logJSON.info('GooglePay Receipt', googlePayReceipt);

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
                }

                try {
                  await moneyHash.proceedWith({
                    type: 'method',
                    id: 'GOOGLE_PAY',
                    intentId,
                  });

                  const intentDetails = await moneyHash.submitPaymentReceipt({
                    nativeReceiptData: googlePayReceipt,
                    intentId,
                  });
                  logJSON.response('Submit Receipt', intentDetails);
                  toast.success(`Submitted receipt successfully, check logs.`);
                } catch (error) {
                  toast.error('Failed to submit receipt, check logs');
                  logJSON.error('Submit Receipt', error);
                }

                setIsLoading(false);
              }}
            />
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
          localStorage.setItem('google-pay-env', v);
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
          <SelectItem value="preprod">Pre-Prod</SelectItem>
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

function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          aria-hidden="true"
          className="w-9 h-9"
        >
          <path
            fill="#4285F4"
            d="M117.6,61.3636364 C117.6,57.1090909 117.218182,53.0181818 116.509091,49.0909091 L60,49.0909091 L60,72.3 L92.2909091,72.3 C90.9,79.8 86.6727273,86.1545455 80.3181818,90.4090909 L80.3181818,105.463636 L99.7090909,105.463636 C111.054545,95.0181818 117.6,79.6363636 117.6,61.3636364 L117.6,61.3636364 Z"
          />
          <path
            fill="#34A853"
            d="M60,120 C76.2,120 89.7818182,114.627273 99.7090909,105.463636 L80.3181818,90.4090909 C74.9454545,94.0090909 68.0727273,96.1363636 60,96.1363636 C44.3727273,96.1363636 31.1454545,85.5818182 26.4545455,71.4 L6.38181818,71.4 L6.38181818,86.9454545 C16.2545455,106.554545 36.5454545,120 60,120 L60,120 Z"
          />
          <path
            fill="#FBBC05"
            d="M26.4545455,71.4 C25.2727273,67.8 24.5454545,63.9545455 24.5454545,60 C24.5454545,56.0454545 25.2727273,52.2 26.4545455,48.6 L26.4545455,33.0545455 L6.38181818,33.0545455 C2.31818182,41.1545455 0,50.3181818 0,60 C0,69.6818182 2.31818182,78.8454545 6.38181818,86.9454545 L26.4545455,71.4 L26.4545455,71.4 Z"
          />
          <path
            fill="#EA4335"
            d="M60,23.8636364 C68.8090909,23.8636364 76.7181818,26.8909091 82.9363636,32.8363636 L100.145455,15.6272727 C89.7818182,5.94545455 76.2,0 60,0 C36.5454545,0 16.2545455,13.4454545 6.38181818,33.0545455 L26.4545455,48.6 C31.1454545,34.4181818 44.3727273,23.8636364 60,23.8636364 L60,23.8636364 Z"
          />
        </svg>
        <span className="font-bold text-3xl">Pay</span>
      </div>
      <h1 className="text-3xl font-medium -mt-2">Interactive Demo</h1>
    </header>
  );
}
