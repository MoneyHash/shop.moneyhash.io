import { useEffect, useRef, useState } from 'react';
import MoneyHash, {
  Method,
  NativeReceiptData,
} from '@moneyhash/js-sdk/headless';
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

type Env = 'production' | 'staging' | 'preprod';

type FormConfiguration = {
  intentConfig: string;
  apiKey: string;
  env: Env;
  publicApiKey: string;
};

type SamsungPayPaymentMethods = Record<string, unknown>;
type SamsungPayTransactionDetail = Record<string, unknown>;

type SamsungPayCredential = {
  '3DS'?: { data: string; type?: string; version?: string };
  [key: string]: unknown;
};

type SamsungPayClient = {
  isReadyToPay: (
    paymentMethods: SamsungPayPaymentMethods,
  ) => Promise<{ result: boolean }>;
  createButton: (options: {
    onClick: () => void;
    buttonStyle?: 'black' | 'white' | 'white-outline';
    type?: 'buy' | 'checkout' | 'pay' | 'continue';
  }) => HTMLElement;
  loadPaymentSheet: (
    paymentMethods: SamsungPayPaymentMethods,
    transactionDetail: SamsungPayTransactionDetail,
  ) => Promise<SamsungPayCredential>;
  notify: (result: {
    status: 'CHARGED' | 'CANCELED' | 'REJECTED' | 'ERRED';
    provider?: string;
  }) => void;
};

declare global {
  interface Window {
    SamsungPay?: {
      PaymentClient: new (options: { environment: string }) => SamsungPayClient;
    };
  }
}

function buildSamsungPayConfig(
  nativePayData: NonNullable<Method['nativePayData']>,
) {
  const paymentMethods: SamsungPayPaymentMethods = {
    version: '2',
    serviceId: nativePayData.service_id,
    protocol: 'PROTOCOL_3DS',
    allowedBrands: nativePayData.allowed_card_networks,
    isCardholderNameRequired: true,
  };

  const transactionDetail: SamsungPayTransactionDetail = {
    orderNumber: nativePayData.trx_uuid,
    merchant: {
      name: nativePayData.merchant_name,
      url: window.location.hostname,
      id: nativePayData.merchant_id,
      countryCode: nativePayData.country_code,
    },
    amount: {
      option: 'FORMAT_TOTAL_ESTIMATED_AMOUNT',
      currency: nativePayData.currency_code,
      total: nativePayData.amount,
    },
  };

  return { paymentMethods, transactionDetail };
}

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
  (localStorage.getItem('samsung-pay-env') as Env) || 'production';
const API_URLS: Record<Env, string> = {
  production: 'https://web.moneyhash.io/api/v1.1',
  staging: 'https://staging-web.moneyhash.io/api/v1.1',
  preprod: 'https://preprod-web.moneyhash.io/api/v1.1',
};
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

export default function SamsungPay() {
  const [config, setConfig] = useState<FormConfiguration>(() => ({
    intentConfig: defaultConfig,
    apiKey: defaultApiKey[storedEnv],
    env: storedEnv,
    publicApiKey: defaultPublicApiKey[storedEnv],
  }));
  const [nativePayData, setNativePayData] =
    useState<Method['nativePayData']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallbackButton, setShowFallbackButton] = useState(false);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<SamsungPayClient | null>(null);
  const sheetConfigRef = useRef<ReturnType<
    typeof buildSamsungPayConfig
  > | null>(null);
  // Keeps the click handler bound to the SDK button reading the latest config.
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const { intentConfig } = config;
    setIsLoading(true);
    setNativePayData(null);
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
        const { expressMethods, paymentMethods } = response;
        const samsungPay = [...expressMethods, ...paymentMethods].find(
          m => m.id === 'SAMSUNG_PAY',
        );

        if (!samsungPay?.nativePayData) {
          toast.error('Samsung Pay is not available');
          logJSON.response('getMethods', response);
        } else {
          logJSON.response(
            'getMethods: Samsung Pay native data',
            samsungPay.nativePayData,
          );
          setNativePayData(samsungPay.nativePayData);
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

  useEffect(() => {
    const container = buttonContainerRef.current;
    if (!nativePayData || !container) return;

    let cancelled = false;
    container.replaceChildren();
    setShowFallbackButton(false);
    clientRef.current = null;

    const sheetConfig = buildSamsungPayConfig(nativePayData);
    sheetConfigRef.current = sheetConfig;
    const { environment } = nativePayData;
    logJSON.info('Samsung Pay Config', { environment, ...sheetConfig });

    if (!window.SamsungPay) {
      toast.error('Samsung Pay SDK failed to load');
      return;
    }

    const client = new window.SamsungPay.PaymentClient({ environment });
    clientRef.current = client;

    client
      .isReadyToPay(sheetConfig.paymentMethods)
      .then(response => {
        if (cancelled) return;
        logJSON.response('isReadyToPay', response);
        if (!response?.result) {
          toast.error('Samsung Pay is not ready on this device/browser');
          setShowFallbackButton(true);
          return;
        }

        try {
          const button = client.createButton({
            onClick: onSamsungPayClick,
            buttonStyle: 'white',
            type: 'buy',
          });
          container.appendChild(button);
        } catch (error) {
          logJSON.error('createButton', error);
          setShowFallbackButton(true);
        }
      })
      .catch(error => {
        if (cancelled) return;
        toast.error('Samsung Pay setup failed, check logs');
        logJSON.error('isReadyToPay', error);
        setShowFallbackButton(true);
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativePayData]);

  async function onSamsungPayClick() {
    const client = clientRef.current;
    const sheetConfig = sheetConfigRef.current;
    if (!client || !sheetConfig) return;

    let credential: SamsungPayCredential;
    try {
      credential = await client.loadPaymentSheet(
        sheetConfig.paymentMethods,
        sheetConfig.transactionDetail,
      );
    } catch (error) {
      toast.error('Samsung Pay sheet failed or cancelled, check logs');
      logJSON.error('loadPaymentSheet', error);
      return;
    }

    const { intentConfig, env, apiKey } = configRef.current;
    logJSON.info('Samsung Pay Credential', credential);
    setIsLoading(true);

    // SDK types require receiptBillingData, but Samsung Pay doesn't send it.
    const samsungPayReceipt = {
      receipt: JSON.stringify(credential),
    } as NativeReceiptData;
    logJSON.info('Samsung Pay Receipt', samsungPayReceipt);

    let intentId;

    try {
      intentId = await axios
        .post(`${API_URLS[env]}/payments/intent/`, JSON.parse(intentConfig), {
          headers: {
            'x-api-key': apiKey,
          },
        })
        .then(res => res.data.data.id);
    } catch (error) {
      toast.error('Failed to create intent, check logs');
      logJSON.error('Create Intent', error);
    }

    try {
      await moneyHash.proceedWith({
        type: 'method',
        id: 'SAMSUNG_PAY',
        intentId,
      });

      const intentDetails = await moneyHash.submitPaymentReceipt({
        nativeReceiptData: samsungPayReceipt,
        intentId,
      });
      logJSON.response('Submit Receipt', intentDetails);
      toast.success(`Submitted receipt successfully, check logs.`);
      client.notify({ status: 'CHARGED' });
    } catch (error) {
      toast.error('Failed to submit receipt, check logs');
      logJSON.error('Submit Receipt', error);
      client.notify({ status: 'ERRED', provider: 'MoneyHash' });
    }

    setIsLoading(false);
  }

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
            <div
              ref={buttonContainerRef}
              className="[&>*]:!w-full [&>*]:border [&>*]:border-input [&>*]:rounded"
            />
            {showFallbackButton && (
              <Button onClick={() => onSamsungPayClick()}>
                Pay with Samsung Pay
              </Button>
            )}
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
          localStorage.setItem('samsung-pay-env', v);
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
        <span className="font-bold text-3xl tracking-[0.2em] text-[#1428a0]">
          SAMSUNG
        </span>
        <span className="font-bold text-3xl">Pay</span>
      </div>
      <h1 className="text-3xl font-medium -mt-2">Interactive Demo</h1>
    </header>
  );
}
