import { useEffect, useState } from 'react';
import MoneyHash, { IntentDetails } from '@moneyhash/js-sdk/headless';
import toast from 'react-hot-toast';
import { SubscriptionPlan } from '@moneyhash/js-sdk';
import { cn } from '@/utils/cn';
import NavBar from '@/components/navbar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectFloatingLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { logJSON } from '@/utils/logJSON';
import { MoneyHashLogo } from '@/components/moneyHashLogo';
import Loader from '@/components/loader';
import { IntentStateRenderer } from '@/components/checkout/intentStateRenderer';
import { MoneyHashProvider } from '@/context/moneyHashProvider';
import { SubscriptionPlanCard } from '@/components/subscriptionPlanCard';

type Env = 'production' | 'staging';

type FormConfiguration = {
  planGroupId: string;
  customerId: string;
  env: Env;
  apiKey: string;
  publicApiKey: string;
};

const storedEnv =
  (localStorage.getItem('subscription-env') as Env) || 'production';
if (storedEnv === 'staging') {
  window.MONEYHASH_IFRAME_URL = 'https://stg-embed.moneyhash.io';
  window.API_URL = 'https://staging-web.moneyhash.io';
  window.MONEYHASH_VAULT_INPUT_IFRAME_URL =
    'https://vault-staging-form.moneyhash.io';
  window.MONEYHASH_VAULT_API_URL = 'https://vault-staging.moneyhash.io';
}

const moneyHash = new MoneyHash({
  type: 'payment',
  publicApiKey: '',
});

export default function Subscriptions() {
  const [config, setConfig] = useState<FormConfiguration>(() => ({
    planGroupId: '4L25xY9',
    customerId: 'd6006d6d-d7d1-4eb1-81aa-982efa56f599',
    apiKey: localStorage.getItem('subscription-apiKey') || '',
    publicApiKey: localStorage.getItem('subscription-publicApiKey') || '',
    env: storedEnv,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[] | null
  >(null);

  useEffect(() => {
    if (!config.apiKey || !config.publicApiKey) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    logJSON.info('Configuration Used', { ...config });

    moneyHash.setPublicApiKey(config.publicApiKey);
    moneyHash
      .getSubscriptionPlans({
        customerId: config.customerId,
        planGroupId: config.planGroupId,
      })
      .then(subscriptionPlans => {
        logJSON.response('Subscription Plans', subscriptionPlans);
        setSubscriptionPlans(
          subscriptionPlans.sort((a, b) => a.amount - b.amount),
        );
      })
      .catch(e => {
        toast.error(`Error fetching subscription plans | ${e.message}`);
        logJSON.error('getSubscriptionPlans', e);
      })
      .finally(() => setIsLoading(false));
  }, [config]);

  return (
    <>
      <NavBar hideCart hideCurrency hideConfig />

      <section className=" mx-auto px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 max-w-screen-xl">
        <Header />
        <div className="grid grid-cols-1 items-start md:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col gap-4 md:col-span-2 ">
            {isLoading ? (
              <div className="flex items-center justify-center h-72">
                <Loader />
              </div>
            ) : subscriptionPlans ? (
              <SubscriptionEmbed
                subscriptionPlans={subscriptionPlans}
                planGroupId={config.planGroupId}
                customerId={config.customerId}
              />
            ) : (
              <p className="text-lg text-center text-muted-foreground">
                No subscription plans found.
              </p>
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

function SubscriptionEmbed({
  planGroupId,
  customerId,
  subscriptionPlans,
}: {
  subscriptionPlans: SubscriptionPlan[];
  planGroupId: string;
  customerId: string;
}) {
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);

  if (intentDetails) {
    return (
      <div className="flex flex-col gap-4">
        <SubscriptionPlanCard
          plan={intentDetails.subscription?.plan!}
          onReset={() => setIntentDetails(null)}
        />
        <MoneyHashProvider moneyHash={moneyHash}>
          <IntentStateRenderer
            isSubscription
            onIntentDetailsChange={setIntentDetails}
            paymentMethod={intentDetails.selectedMethod!}
            intentDetails={intentDetails}
          />
        </MoneyHashProvider>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {subscriptionPlans.map(plan => (
        <SubscriptionPlanCard
          key={plan.id}
          plan={plan}
          onSubscribe={() =>
            moneyHash
              .selectSubscriptionPlan({
                planId: plan.id,
                planGroupId,
                customerId,
              })
              .then(intentDetails => {
                logJSON.response('selectSubscriptionPlan', intentDetails);
                setIntentDetails(intentDetails);
              })
              .catch(e => {
                toast.error(`Error selecting subscription plan | ${e.message}`);
                logJSON.error('selectSubscriptionPlan', e);
              })
          }
        />
      ))}
    </div>
  );
}

function ConfigurationForm({
  initialConfiguration,
  onUpdate,
}: {
  initialConfiguration: FormConfiguration;
  onUpdate: (options: FormConfiguration) => void;
}) {
  const [planGroupId, setPlanGroupId] = useState(
    initialConfiguration.planGroupId,
  );
  const [customerId, setCustomerId] = useState(initialConfiguration.customerId);
  const [apiKey, setApiKey] = useState(initialConfiguration.apiKey);
  const [publicApiKey, setPublicApiKey] = useState(
    initialConfiguration.publicApiKey,
  );

  return (
    <div className="flex flex-col gap-4 sticky top-20">
      <Input
        label="Plan Group ID"
        value={planGroupId}
        onChange={e => setPlanGroupId(e.target.value)}
        containerClassName="flex-1"
      />
      <Input
        label="Customer ID"
        value={customerId}
        onChange={e => setCustomerId(e.target.value)}
        containerClassName="flex-1"
      />
      {(!initialConfiguration.apiKey || !initialConfiguration.publicApiKey) && (
        <p className="text-sm text-muted-foreground">
          Enter your API keys to load subscription plans.
        </p>
      )}
      <Input
        label="Account API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        containerClassName={cn(
          !apiKey && 'rounded ring-2 ring-primary/60 animate-pulse',
        )}
      />
      <Input
        label="Public Account API Key"
        value={publicApiKey}
        onChange={e => setPublicApiKey(e.target.value)}
        containerClassName={cn(
          !publicApiKey && 'rounded ring-2 ring-primary/60 animate-pulse',
        )}
      />
      <Select
        value={initialConfiguration.env}
        onValueChange={v => {
          localStorage.setItem('subscription-env', v);
          window.location.reload();
        }}
      >
        <SelectTrigger className="flex-1 border border-input group relative focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/20">
          <SelectValue />
          <SelectFloatingLabel>Environment</SelectFloatingLabel>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="production">Production</SelectItem>
          <SelectItem value="staging">Staging</SelectItem>
        </SelectContent>
      </Select>

      <Button
        disabled={!planGroupId || !customerId}
        onClick={() => {
          try {
            if (!apiKey || !publicApiKey) {
              toast.error('Please set both API keys.');
              return;
            }
            localStorage.setItem('subscription-apiKey', apiKey);
            localStorage.setItem('subscription-publicApiKey', publicApiKey);
            onUpdate({
              planGroupId,
              customerId,
              apiKey,
              publicApiKey,
              env: initialConfiguration.env,
            });
          } catch (error) {
            toast.error('Invalid JSON format');
          }
        }}
      >
        Update
      </Button>
      {(!planGroupId || !customerId) && (
        <p className="text-sm text-muted-foreground">
          Please provide both Plan Group ID and Customer ID to load the
          configuration.
        </p>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center gap-2">
      <div className="flex items-center gap-2">
        <MoneyHashLogo className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-semibold">Subscriptions</h1>
    </header>
  );
}
