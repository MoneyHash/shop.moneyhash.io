import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  LoyaltyPayload,
  LoyaltyProvider,
} from '@moneyhash/js-sdk/headless';

import { useMoneyHash } from './moneyHashProvider';
import { logJSON } from '@/utils/logJSON';

type Status = 'idle' | 'checking' | 'eligible' | 'ineligible' | 'error';

type LoyaltyContextValue = {
  providers: LoyaltyProvider[];
  isLoadingProviders: boolean;
  selectedProvider: LoyaltyProvider | null;
  selectProvider: (provider: LoyaltyProvider | null) => void;
  identifier: string;
  setIdentifier: (value: string) => void;
  status: Status;
  checkEligibility: () => Promise<void>;
  reset: () => void;
  loyaltyData: LoyaltyPayload | null;
};

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

export function LoyaltyProviderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const moneyHash = useMoneyHash();
  const [providers, setProviders] = useState<LoyaltyProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] =
    useState<LoyaltyProvider | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let cancelled = false;
    moneyHash
      .getLoyaltyProviders()
      .then(response => {
        logJSON.response('getLoyaltyProviders', response);
        if (!cancelled) setProviders(response);
      })
      .catch(error => {
        logJSON.error('getLoyaltyProviders', error);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProviders(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moneyHash]);

  const selectProvider = useCallback((provider: LoyaltyProvider | null) => {
    setSelectedProvider(provider);
    setIdentifier('');
    setStatus('idle');
  }, []);

  const updateIdentifier = useCallback((value: string) => {
    setIdentifier(value);
    setStatus('idle');
  }, []);

  const checkEligibility = useCallback(async () => {
    if (!selectedProvider || !identifier) return;
    setStatus('checking');
    try {
      const result = await moneyHash.checkLoyaltyEligibility({
        providerId: selectedProvider.id,
        identifierType: selectedProvider.identifierType,
        identifier,
      });
      logJSON.response('checkLoyaltyEligibility', result);
      setStatus(result.eligible ? 'eligible' : 'ineligible');
    } catch (error) {
      logJSON.error('checkLoyaltyEligibility', error);
      setStatus('error');
    }
  }, [moneyHash, selectedProvider, identifier]);

  const reset = useCallback(() => {
    setSelectedProvider(null);
    setIdentifier('');
    setStatus('idle');
  }, []);

  const loyaltyData = useMemo<LoyaltyPayload | null>(() => {
    if (status !== 'eligible' || !selectedProvider) return null;
    return {
      providerId: selectedProvider.id,
      identifierType: selectedProvider.identifierType,
      identifier,
    };
  }, [status, selectedProvider, identifier]);

  const value = useMemo<LoyaltyContextValue>(
    () => ({
      providers,
      isLoadingProviders,
      selectedProvider,
      selectProvider,
      identifier,
      setIdentifier: updateIdentifier,
      status,
      checkEligibility,
      reset,
      loyaltyData,
    }),
    [
      providers,
      isLoadingProviders,
      selectedProvider,
      selectProvider,
      identifier,
      updateIdentifier,
      status,
      checkEligibility,
      reset,
      loyaltyData,
    ],
  );

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
}

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProviderProvider');
  }
  return context;
};
