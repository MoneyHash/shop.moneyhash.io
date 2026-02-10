/* eslint-disable no-console, func-names */
import { CardBrand, MaskedCard } from '@moneyhash/js-sdk';
import MoneyHash from '@moneyhash/js-sdk/headless';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMoneyHash } from './moneyHashProvider';
import { logJSON } from '@/utils/logJSON';
import { getCookie } from '@/utils/cookies';
import { useTotalPrice } from '@/store/useShoppingCart';
import useCurrency from '@/store/useCurrency';

type ClickToPayProviderProps = {
  children: React.ReactNode;
  nativePayData?: Record<string, any> | null;
};

type ContextValue = {
  isC2pLoading: boolean;
  isC2pError: boolean;
  setIsC2pError: Dispatch<SetStateAction<boolean>>;
  checkoutAsGuest: boolean;
  setCheckoutAsGuest: Dispatch<SetStateAction<boolean>>;
  availableCards: CardBrand[];
  payWith: (MaskedCard['srcDigitalCardId'] & {}) | 'NEW_CARD' | null;
  setPayWith: Dispatch<SetStateAction<(string & {}) | 'NEW_CARD' | null>>;
};

const ClickToPayContext = createContext<ContextValue | null>(null);

export function ClickToPayProvider({
  children,
  nativePayData,
}: ClickToPayProviderProps) {
  const [isC2pLoading, setIsC2pLoading] = useState(true);
  const [isC2pError, setIsC2pError] = useState(false);
  const [availableCards, setAvailableCards] = useState<CardBrand[]>([]);
  const [payWith, setPayWith] = useState<
    (MaskedCard['srcDigitalCardId'] & {}) | 'NEW_CARD' | null
  >(null);
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(true);

  const moneyHash = useMoneyHash();
  const currency = useCurrency(state => state.currency);
  const totalPrice = useTotalPrice();

  useEffect(() => {
    if (!nativePayData) return;

    if (window.FAILED_C2P_INIT) {
      c2pInitFailure(moneyHash);
    } else if (window.FAILED_C2P_CKO) {
      c2pCKOFailure(moneyHash);
    } else if (window.FAILED_C2P_UNK) {
      c2pUnknownFailure(moneyHash);
    }

    logJSON.info('C2P Cookie', getCookie('c2p'));

    async function initializeC2P() {
      try {
        const { availableCardBrands } = await moneyHash.click2Pay.init({
          env: 'sandbox',
          dpaLocale: 'en_US',
          checkoutExperience: 'PAYMENT_SETTINGS',
          srcDpaId: nativePayData!.dpa_id,
          dpaData: {
            dpaName: nativePayData!.dpa_name,
          },
          dpaTransactionOptions: {
            confirmPayment: false,
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
          cardBrands: ['mastercard', 'visa', 'amex', 'discover'],
          recognitionToken: getCookie('c2p') || undefined,
        });

        setAvailableCards(availableCardBrands);
        setIsC2pLoading(false);
      } catch (error: any) {
        setPayWith('NEW_CARD');
        setCheckoutAsGuest(false);
        setIsC2pError(true);
        setIsC2pLoading(false);
      }
    }

    initializeC2P();
  }, [currency, moneyHash, nativePayData, totalPrice]);

  const value = useMemo(
    () => ({
      availableCards,
      checkoutAsGuest,
      setCheckoutAsGuest,
      isC2pError,
      setIsC2pError,
      payWith,
      setPayWith,
      isC2pLoading,
    }),
    [availableCards, checkoutAsGuest, isC2pError, isC2pLoading, payWith],
  );
  return (
    <ClickToPayContext.Provider value={value}>
      {children}
    </ClickToPayContext.Provider>
  );
}

export const useClickToPay = () => {
  const context = useContext(ClickToPayContext);

  if (!context)
    throw new Error('useClickToPay must be used within a ThemeProvider');

  return context;
};

declare global {
  interface Window {
    FAILED_C2P_INIT?: boolean;
    FAILED_C2P_CKO?: boolean;
    FAILED_C2P_UNK?: boolean;
  }
}

function c2pInitFailure(moneyHash: MoneyHash<'payment'>) {
  const prototype = Object.getPrototypeOf(moneyHash.click2Pay);
  const WRAPPED = Symbol('wrapped');

  Object.getOwnPropertyNames(prototype).forEach(methodName => {
    if (methodName === 'constructor') return;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    if (!descriptor || typeof descriptor.value !== 'function') return;

    const originalFn = descriptor.value;

    // prevent double wrapping
    if ((originalFn as any)[WRAPPED]) return;

    const wrappedFn = async function override(this: any, ...params: any[]) {
      console.warn(
        `[MA SV2] Invoking SV2 method: ${methodName} with params`,
        params,
      );

      // example forced error
      if (methodName === 'init') {
        throw new Error('SV2 init forced failure');
      }

      try {
        const response = await originalFn.apply(this, params);
        console.warn(
          `[MA SV2] SV2 method: ${methodName} resolved with`,
          response,
        );
        return response;
      } catch (error) {
        console.error(
          `[MA SV2] SV2 method: ${methodName} rejected with`,
          error,
        );
        throw error;
      }
    };

    // mark as wrapped
    (wrappedFn as any)[WRAPPED] = true;

    Object.defineProperty(prototype, methodName, {
      ...descriptor,
      value: wrappedFn,
    });
  });
}

function c2pCKOFailure(moneyHash: MoneyHash<'payment'>) {
  const prototype = Object.getPrototypeOf(moneyHash.click2Pay);
  const WRAPPED = Symbol('wrapped');

  Object.getOwnPropertyNames(prototype).forEach(methodName => {
    if (methodName === 'constructor') return;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    if (!descriptor || typeof descriptor.value !== 'function') return;

    const originalFn = descriptor.value;

    // prevent double wrapping
    if ((originalFn as any)[WRAPPED]) return;

    const wrappedFn = async function (this: any, ...params: any[]) {
      console.warn(
        `[MA SV2] Invoking SV2 method: ${methodName} with params`,
        params,
      );

      // force error for specific method
      if (methodName === 'checkoutWithCard') {
        throw new Error();
      }

      try {
        const response = await originalFn.apply(this, params);
        console.warn(
          `[MA SV2] SV2 method: ${methodName} resolved with`,
          response,
        );
        return response;
      } catch (error) {
        console.error(
          `[MA SV2] SV2 method: ${methodName} rejected with`,
          error,
        );
        throw error;
      }
    };

    (wrappedFn as any)[WRAPPED] = true;

    Object.defineProperty(prototype, methodName, {
      ...descriptor,
      value: wrappedFn,
    });
  });
}

function c2pUnknownFailure(moneyHash: MoneyHash<'payment'>) {
  const prototype = Object.getPrototypeOf(moneyHash.click2Pay);
  const WRAPPED = Symbol('wrapped');

  Object.getOwnPropertyNames(prototype).forEach(methodName => {
    if (methodName === 'constructor') return;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    if (!descriptor || typeof descriptor.value !== 'function') return;

    const originalFn = descriptor.value;

    // prevent double wrapping
    if ((originalFn as any)[WRAPPED]) return;

    const wrappedFn = async function (this: any, ...params: any[]) {
      console.warn(
        `[MA SV2] Invoking SV2 method: ${methodName} with params`,
        params,
      );

      // force error for specific method
      if (methodName === 'authenticate') {
        throw Object.assign(
          new Error(
            'This indicates that the server is not able to establish communication with any of the requested card networks.',
          ),
          {
            reason: 'UNKNOWN_ERROR',
            details: [],
          },
        );
      }

      try {
        const response = await originalFn.apply(this, params);
        console.warn(
          `[MA SV2] SV2 method: ${methodName} resolved with`,
          response,
        );
        return response;
      } catch (error) {
        console.error(
          `[MA SV2] SV2 method: ${methodName} rejected with`,
          error,
        );
        throw error;
      }
    };

    (wrappedFn as any)[WRAPPED] = true;

    Object.defineProperty(prototype, methodName, {
      ...descriptor,
      value: wrappedFn,
    });
  });
}
