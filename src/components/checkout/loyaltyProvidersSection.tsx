import { useMemo } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  IdCard,
  Loader2,
  Mail,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input/max';
import type { LoyaltyProvider } from '@moneyhash/js-sdk/headless';

import { useLoyalty } from '@/context/loyaltyProvider';
import useCurrency from '@/store/useCurrency';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radioGroup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phoneInput';
import { cn } from '@/utils/cn';

type IdentifierType = LoyaltyProvider['identifierType'];

const identifierMeta: Record<
  IdentifierType,
  { Icon: typeof Phone; label: string }
> = {
  PHONE_NUMBER: { Icon: Phone, label: 'Phone' },
  EMAIL: { Icon: Mail, label: 'Email' },
  NATIONAL_ID: { Icon: IdCard, label: 'National ID' },
};

const MOKAFAA_ICON =
  'https://staging-cdn.moneyhash.io/providers/icons/2023/04/12/ac59fb680c3642ecba26cac50b0a51c0.svg';
const WALA_ONE_ICON =
  'https://staging-cdn.moneyhash.io/providers/icons/2025/12/22/e1a461055dbe48409e85d1f580db5731.svg';

function iconForProvider(provider: LoyaltyProvider) {
  const key = provider.name.trim().toLowerCase();
  if (key.includes('mokfaa') || key.includes('mokafaa')) return MOKAFAA_ICON;
  if (key.includes('wala')) return WALA_ONE_ICON;
  return undefined;
}

export function LoyaltyProvidersSection({ className }: { className?: string }) {
  const currency = useCurrency(state => state.currency);
  const {
    providers,
    isLoadingProviders,
    selectedProvider,
    selectProvider,
    identifier,
    setIdentifier,
    status,
    checkEligibility,
    reset,
  } = useLoyalty();

  const isIdentifierValid = useMemo(() => {
    if (!selectedProvider || !identifier) return false;
    switch (selectedProvider.identifierType) {
      case 'PHONE_NUMBER':
        return isValidPhoneNumber(identifier);
      case 'EMAIL':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      case 'NATIONAL_ID':
        return identifier.trim().length >= 5;
      default:
        return false;
    }
  }, [selectedProvider, identifier]);

  // Loyalty providers are only available for SAR-denominated orders.
  if (currency !== 'SAR') return null;

  if (!isLoadingProviders && providers.length === 0) return null;

  return (
    <div className={cn('relative border rounded p-3 pt-6', className)}>
      <p className="text-xs absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-2 text-bolder inline-flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary" />
        Earn loyalty points
      </p>

      {isLoadingProviders ? (
        <ProvidersSkeleton />
      ) : (
        <RadioGroup
          className="overflow-x-auto flex gap-2 py-1 px-0.5 -mx-0.5"
          value={selectedProvider?.id || ''}
          onValueChange={id => {
            const provider = providers.find(p => p.id === id);
            if (provider) selectProvider(provider);
          }}
        >
          {providers.map(provider => {
            const isSelected = selectedProvider?.id === provider.id;
            const isEligible = isSelected && status === 'eligible';
            return (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isEligible={isEligible}
              />
            );
          })}
        </RadioGroup>
      )}

      {selectedProvider && (
        <div className="mt-3 pt-3 border-t border-input/60 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <div className="flex-1 min-w-0">
              <IdentifierField
                identifierType={selectedProvider.identifierType}
                value={identifier}
                onChange={setIdentifier}
              />
            </div>
            <Button
              variant={status === 'eligible' ? 'secondary' : 'default'}
              size="sm"
              className="h-9 sm:w-auto w-full"
              disabled={!isIdentifierValid || status === 'checking'}
              onClick={() => checkEligibility()}
            >
              {status === 'checking' && (
                <Loader2 className="h-3.5 w-3.5 me-1.5 animate-spin" />
              )}
              {status === 'eligible' ? 'Verified' : 'Check eligibility'}
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <StatusPill status={status} />
            <button
              type="button"
              onClick={reset}
              className="text-[11px] text-subtler hover:text-bolder inline-flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderCard({
  provider,
  isEligible,
}: {
  provider: LoyaltyProvider;
  isEligible: boolean;
}) {
  const { Icon } = identifierMeta[provider.identifierType];
  const iconUrl = iconForProvider(provider);

  return (
    <div className="relative">
      <RadioGroupItem
        id={`loyalty-${provider.id}`}
        value={provider.id}
        className="sr-only peer"
      />
      <label
        htmlFor={`loyalty-${provider.id}`}
        className={cn(
          'h-10 px-2.5 flex flex-shrink-0 items-center gap-2 border border-input rounded-md cursor-pointer text-subtle relative',
          'peer-aria-checked:text-bolder peer-aria-checked:border-ring peer-aria-checked:ring-2 peer-aria-checked:ring-ring/30 peer-aria-checked:bg-primary/5',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          isEligible &&
            'border-emerald-500/50 ring-2 ring-emerald-500/25 bg-emerald-500/[0.04]',
        )}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="w-5 h-5 object-contain flex-shrink-0"
          />
        ) : (
          <Icon className="w-3.5 h-3.5 flex-shrink-0 text-subtler" />
        )}
        <span className="text-xs font-medium truncate text-bolder max-w-[120px]">
          {provider.name}
        </span>
        {isEligible && (
          <BadgeCheck
            className="absolute -top-1.5 -end-1.5 h-4 w-4 text-emerald-500 fill-background"
            aria-hidden
          />
        )}
      </label>
    </div>
  );
}

function IdentifierField({
  identifierType,
  value,
  onChange,
}: {
  identifierType: IdentifierType;
  value: string;
  onChange: (value: string) => void;
}) {
  if (identifierType === 'PHONE_NUMBER') {
    return (
      <PhoneInput
        value={value}
        onChange={onChange}
        label="Phone number"
        defaultCountry="EG"
      />
    );
  }
  if (identifierType === 'EMAIL') {
    return (
      <Input
        id="loyalty-email"
        type="email"
        label="Email address"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    );
  }
  return (
    <Input
      id="loyalty-national-id"
      label="National ID"
      value={value}
      inputMode="numeric"
      onChange={event => onChange(event.target.value)}
    />
  );
}

type Status = ReturnType<typeof useLoyalty>['status'];

function StatusPill({ status }: { status: Status }) {
  if (status === 'idle') {
    return (
      <p className="text-[11px] text-subtler">
        Verify to apply your loyalty rewards.
      </p>
    );
  }
  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-subtle">
        <Loader2 className="h-3 w-3 animate-spin" /> Checking eligibility…
      </span>
    );
  }
  if (status === 'eligible') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30">
        <BadgeCheck className="h-3 w-3" />
        You&apos;ll earn points on this order
      </span>
    );
  }
  if (status === 'ineligible') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30">
        <AlertCircle className="h-3 w-3" />
        Not enrolled — you can still continue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive ring-1 ring-destructive/30">
      <AlertCircle className="h-3 w-3" />
      Couldn&apos;t check — try again
    </span>
  );
}

function ProvidersSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {['s1', 's2', 's3'].map(key => (
        <div
          key={key}
          className="w-32 h-10 rounded-md border border-input bg-accent/40 animate-pulse flex-shrink-0"
        />
      ))}
    </div>
  );
}
