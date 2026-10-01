import { useEffect, useRef, useState } from 'react';
import MoneyHash, {
  Method,
  IntentStateDetails,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const storedEnv =
  (localStorage.getItem('apple-pay-env') as Env) || 'production';
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
  publicApiKey: '',
});

// Hardcoded Apple Pay native data used by the "Fixed Native Data" button, so we
// can test the flow without depending on getMethods.
const fixedNativePayData: NonNullable<Method['nativePayData']> = {
  amount: 123,
  country_code: 'AE',
  currency_code: 'USD',
  merchant_id: 'merchant.cko.selfserve.donttouch',
  method_id: '9eYdqD9',
  supported_capabilities: ['supportsCredit', 'supports3DS', 'supportsDebit'],
  supported_networks: ['mada', 'amex', 'visa', 'masterCard'],
  supported_regions: ['US', 'AE'],
};

export default function ApplePay() {
  const [config, setConfig] = useState<FormConfiguration>(() => ({
    intentConfig: defaultConfig,
    apiKey: localStorage.getItem('apple-pay-apiKey') || '',
    env: storedEnv,
    publicApiKey: localStorage.getItem('apple-pay-publicApiKey') || '',
  }));
  const [nativePayData, setNativePayData] =
    useState<Method['nativePayData']>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!config.apiKey || !config.publicApiKey) {
      setIsLoading(false);
      return;
    }
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

  // Holds the intent id across Apple Pay sessions. On dialog-based recovery we
  // keep paying for the same intent, so retries reuse this instead of creating
  // a new one. Reset back to '' once a payment fully succeeds.
  const dialogRecoveryIntentId = useRef('');
  // When set, we render the recovery dialog with this error message and an
  // Apple Pay button to retry the payment for the same intent.
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Starts an Apple Pay session for the dialog-based auto-recovery experience.
  // Unlike the in-sheet recovery flow, on a recoverable failure this closes the
  // Apple Pay sheet and surfaces the error in our own dialog, letting the user
  // retry by opening a brand new session for the same intent.
  const startDialogRecoverySession = () => {
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
      toast.error('Failed to create Apple Pay session, check logs.');
      logJSON.error('Create ApplePay Session', error);
      return;
    }

    // Hide the dialog while the Apple Pay sheet is presented. It reopens
    // automatically if this attempt also fails with an auto-recovery error.
    setRecoveryError(null);

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
          session.completeMerchantValidation({});
          toast.error('Failed to validate merchant session, check logs');
          logJSON.error('Validate ApplePay Merchant Session', e);
        });

    session.onpaymentauthorized = async e => {
      const applePayReceipt = {
        receipt: JSON.stringify({ token: e.payment.token }),
        receiptBillingData: {
          email: e.payment.shippingContact?.emailAddress,
        },
      };
      logJSON.response('ApplePay Receipt', applePayReceipt);

      // Create the intent once. On recovery retries we keep paying for the
      // same intent, so we don't create a new one.
      if (!dialogRecoveryIntentId.current) {
        try {
          dialogRecoveryIntentId.current = await axios
            .post(
              `${API_URLS[config.env]}/payments/intent/`,
              JSON.parse(config.intentConfig),
              {
                headers: {
                  'x-api-key': config.apiKey,
                },
              },
            )
            .then(res => res.data.data.id);
        } catch (error) {
          session.completePayment({
            status: ApplePaySession.STATUS_FAILURE,
            errors: [
              new ApplePayError(
                'unknown',
                undefined,
                'Failed to create payment. Please try again.',
              ),
            ],
          });
          toast.error('Failed to create intent, check logs');
          logJSON.error('Create Intent', error);
          return;
        }
      }

      const intentId = dialogRecoveryIntentId.current;

      try {
        // Select Apple Pay right before submitting the receipt. On recovery
        // retries the previous selection was reset, so we (re)select the method
        // with the freshly authorized token.
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

        const autoRecovery =
          intentDetails.state === 'TRANSACTION_FAILED'
            ? (
                intentDetails.stateDetails as IntentStateDetails<'TRANSACTION_FAILED'>
              )?.autoRecovery
            : null;

        if (autoRecovery) {
          logJSON.info(
            'Transaction failed, auto recovery available',
            autoRecovery,
          );

          // Reset the selected method so the user can authorize a new token for
          // the same intent on the next attempt.
          await moneyHash.resetSelectedMethod(intentId);

          // Dismiss the Apple Pay sheet and surface the error in our own
          // dialog, where the user can retry with a fresh session.
          session.completePayment(ApplePaySession.STATUS_FAILURE);
          setRecoveryError(
            autoRecovery.errorMessage ||
              'Payment failed. Please try another card.',
          );
          return;
        }

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        // Payment succeeded, drop the intent so the next click starts fresh.
        dialogRecoveryIntentId.current = '';
        toast.success(`Submitted receipt successfully, check logs.`);
      } catch (error) {
        session.completePayment({
          status: ApplePaySession.STATUS_FAILURE,
          errors: [
            new ApplePayError(
              'unknown',
              undefined,
              'Failed to submit payment. Please try again.',
            ),
          ],
        });
        toast.error('Failed to submit receipt, check logs');
        logJSON.error('Submit Receipt', error);
      }
    };

    session.begin();
  };

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
                      session.completeMerchantValidation({});
                      toast.error(
                        'Failed to validate merchant session, check logs',
                      );
                      logJSON.error('Validate ApplePay Merchant Session', e);
                    });

                let intentId = '';

                session.onpaymentauthorized = async e => {
                  const applePayReceipt = {
                    receipt: JSON.stringify({ token: e.payment.token }),
                    receiptBillingData: {
                      email: e.payment.shippingContact?.emailAddress,
                    },
                  };
                  logJSON.response('ApplePay Receipt', applePayReceipt);

                  // Create the intent once. On auto-recovery retries we keep
                  // paying for the same intent, so we don't create a new one.
                  if (!intentId) {
                    try {
                      intentId = await axios
                        .post(
                          `${API_URLS[config.env]}/payments/intent/`,
                          JSON.parse(config.intentConfig),
                          {
                            headers: {
                              'x-api-key': config.apiKey,
                            },
                          },
                        )
                        .then(res => res.data.data.id);
                    } catch (error) {
                      session.completePayment({
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: [
                          new ApplePayError(
                            'unknown',
                            undefined,
                            'Failed to create payment. Please try again.',
                          ),
                        ],
                      });
                      toast.error('Failed to create intent, check logs');
                      logJSON.error('Create Intent', error);
                      return;
                    }
                  }

                  try {
                    // Select Apple Pay right before submitting the receipt. On
                    // the first attempt the method isn't selected yet, and on
                    // recovery retries the previous selection was reset, so we
                    // (re)select the method with the freshly authorized token.
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

                    // On a failed transaction MoneyHash returns `autoRecovery`
                    // when the failure is eligible for re-authorization, meaning
                    // we can collect another token from the user.
                    const autoRecovery =
                      intentDetails.state === 'TRANSACTION_FAILED'
                        ? (
                            intentDetails.stateDetails as IntentStateDetails<'TRANSACTION_FAILED'>
                          )?.autoRecovery
                        : null;

                    if (autoRecovery) {
                      logJSON.info(
                        'Transaction failed, auto recovery available',
                        autoRecovery,
                      );

                      // Reset the selected method so the user can authorize a
                      // new token for the same intent. We don't reselect here —
                      // the method is selected again before the next submit once
                      // a new token is authorized.
                      await moneyHash.resetSelectedMethod(intentId);

                      // Keep the Apple Pay sheet open and surface the error so
                      // the user can retry with a different card.
                      session.completePayment({
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: [
                          new ApplePayError(
                            'unknown',
                            undefined,
                            autoRecovery.errorMessage ||
                              'Payment failed. Please try another card.',
                          ),
                        ],
                      });
                      if (autoRecovery.errorMessage) {
                        toast.error(`UPDATED: ${autoRecovery.errorMessage}`);
                      }
                      return;
                    }

                    session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    toast.success(
                      `Submitted receipt successfully, check logs.`,
                    );
                  } catch (error) {
                    session.completePayment({
                      status: ApplePaySession.STATUS_FAILURE,
                      errors: [
                        new ApplePayError(
                          'unknown',
                          undefined,
                          'Failed to submit payment. Please try again.',
                        ),
                      ],
                    });
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
                // Fresh click starts a brand new intent; dialog retries reuse it.
                dialogRecoveryIntentId.current = '';
                startDialogRecoverySession();
              }}
            >
              Pay with Apple Pay (Dialog Recovery)
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

                let isCanceled = false;
                session.onvalidatemerchant = e =>
                  moneyHash
                    .validateApplePayMerchantSession({
                      methodId: nativePayData.method_id,
                      validationUrl: e.validationURL,
                    })
                    .then(merchantSession => {
                      if (!isCanceled) {
                        session.completeMerchantValidation(merchantSession);
                      }
                    })
                    .catch(e => {
                      session.completeMerchantValidation({});
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
                session.oncancel = () => {
                  isCanceled = true;
                };
              }}
            >
              Bin Lookup
            </AppleButton>

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
                    merchantCapabilities: nativePayData.supported_capabilities,
                    total: {
                      label: 'Apple Pay',
                      type: 'final',
                      amount: `${nativePayData.amount}`,
                    },
                    requiredShippingContactFields: ['email'],
                    recurringPaymentRequest: {
                      paymentDescription: 'Payment Description',
                      managementURL: window.location.href,
                      tokenNotificationURL:
                        'https://vault-staging.moneyhash.io/api/v1/apple_pay_decryption/merchant-token-events',
                      regularBilling: {
                        label: 'Dummy data',
                        amount: `${nativePayData.amount}`,
                        paymentTiming: 'recurring',
                        recurringPaymentStartDate: new Date(),
                        recurringPaymentIntervalUnit: 'minute',
                        recurringPaymentIntervalCount: 5,
                      },
                    },
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
                      session.completeMerchantValidation({});
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

                  let cardTokenIntentId;

                  try {
                    const baseUrl = API_URLS[config.env].replace(
                      'v1.1',
                      'v1.4',
                    );
                    cardTokenIntentId = await axios
                      .post(
                        `${baseUrl}/tokens/cards/`,
                        {
                          ...JSON.parse(config.intentConfig),
                          card_token_type: 'UNIVERSAL',
                          metadata: {
                            source: 'apple_pay_network_token',
                          },
                        },
                        {
                          headers: {
                            'x-api-key': config.apiKey,
                          },
                        },
                      )
                      .then(res => res.data.data.id);
                  } catch (error) {
                    toast.error('Failed to create intent, check logs');
                    logJSON.error('Create Card Token Intent', error);
                    return;
                  }

                  try {
                    const tokenId = await moneyHash.tokenizeReceipt({
                      receipt: applePayReceipt.receipt,
                      methodId: nativePayData.method_id,
                      cardTokenIntentId,
                    });

                    logJSON.response('Tokenize Receipt', tokenId);
                    toast.success(
                      `Tokenized receipt successfully, check logs.`,
                    );
                  } catch (error) {
                    toast.error('Failed to tokenize receipt, check logs');
                    logJSON.error('Submit Receipt', error);
                  }
                };

                session.begin();
              }}
            >
              Recurring with Apple Pay
            </AppleButton>

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
                      amount: `0`,
                    },
                    requiredShippingContactFields: ['email'],
                    automaticReloadPaymentRequest: {
                      paymentDescription: 'Coffee Card Auto-Reload',
                      automaticReloadBilling: {
                        label: 'Auto-Reload Amount',
                        amount: `${nativePayData.amount}`,
                        type: 'final',
                        paymentTiming: 'automaticReload',
                        automaticReloadPaymentThresholdAmount: '5',
                      },
                      managementURL: window.location.href,
                      tokenNotificationURL:
                        'https://vault-staging.moneyhash.io/api/v1/apple_pay_decryption/merchant-token-events',
                    },
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
                      session.completeMerchantValidation({});
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

                  let cardTokenIntentId;

                  try {
                    const baseUrl = API_URLS[config.env].replace(
                      'v1.1',
                      'v1.4',
                    );
                    cardTokenIntentId = await axios
                      .post(
                        `${baseUrl}/tokens/cards/`,
                        {
                          ...JSON.parse(config.intentConfig),
                          card_token_type: 'UNIVERSAL',
                          metadata: {
                            source: 'apple_pay_network_token',
                          },
                        },
                        {
                          headers: {
                            'x-api-key': config.apiKey,
                          },
                        },
                      )
                      .then(res => res.data.data.id);
                  } catch (error) {
                    toast.error('Failed to create intent, check logs');
                    logJSON.error('Create Card Token Intent', error);
                    return;
                  }

                  try {
                    const tokenId = await moneyHash.tokenizeReceipt({
                      receipt: applePayReceipt.receipt,
                      methodId: nativePayData.method_id,
                      cardTokenIntentId,
                    });

                    logJSON.response('Tokenize Receipt', tokenId);
                    toast.success(
                      `Tokenized receipt successfully, check logs.`,
                    );
                  } catch (error) {
                    toast.error('Failed to tokenize receipt, check logs');
                    logJSON.error('Submit Receipt', error);
                  }
                };

                session.begin();
              }}
            >
              Automatic Reload with Apple Pay
            </AppleButton>

            <AppleButton
              disabled={!nativePayData}
              className={isLoading ? 'animate-pulse' : ''}
              onClick={async () => {
                if (!nativePayData) return;

                let attemptCount = 0;

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
                      session.completeMerchantValidation({});
                      toast.error(
                        'Failed to validate merchant session, check logs',
                      );
                      logJSON.error('Validate ApplePay Merchant Session', e);
                    });

                session.onpaymentauthorized = async e => {
                  if (attemptCount === 0) {
                    attemptCount += 1;
                    session.completePayment({
                      status: ApplePaySession.STATUS_FAILURE,
                      errors: [
                        new ApplePayError(
                          'unknown',
                          undefined,
                          'Custom error message',
                        ),
                      ],
                    });
                    logJSON.info('Simulated decline, asking user to retry', {
                      attemptCount,
                    });
                    return;
                  }

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
                    intentId = await axios
                      .post(
                        `${API_URLS[config.env]}/payments/intent/`,
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
              Fail First Attempt (Retry)!
            </AppleButton>

            <AppleButton
              className={isLoading ? 'animate-pulse' : ''}
              onClick={async () => {
                let session: ApplePaySession;
                try {
                  session = new ApplePaySession(3, {
                    countryCode: fixedNativePayData.country_code,
                    currencyCode: fixedNativePayData.currency_code,
                    supportedNetworks: fixedNativePayData.supported_networks,
                    merchantCapabilities:
                      fixedNativePayData.supported_capabilities,
                    total: {
                      label: 'Apple Pay',
                      type: 'final',
                      amount: `${fixedNativePayData.amount}`,
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
                      methodId: fixedNativePayData.method_id,
                      validationUrl: e.validationURL,
                    })
                    .then(merchantSession =>
                      session.completeMerchantValidation(merchantSession),
                    )
                    .catch(e => {
                      session.completeMerchantValidation({});
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
                  logJSON.response('ApplePay Receipt', applePayReceipt);

                  let intentId;

                  try {
                    intentId = await axios
                      .post(
                        `${API_URLS[config.env]}/payments/intent/`,
                        JSON.parse(config.intentConfig),
                        {
                          headers: {
                            'x-api-key': config.apiKey,
                          },
                        },
                      )
                      .then(res => res.data.data.id);
                  } catch (error) {
                    session.completePayment({
                      status: ApplePaySession.STATUS_FAILURE,
                      errors: [
                        new ApplePayError(
                          'unknown',
                          undefined,
                          'Failed to create payment. Please try again.',
                        ),
                      ],
                    });
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

                    session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    toast.success(
                      `Submitted receipt successfully, check logs.`,
                    );
                  } catch (error) {
                    session.completePayment({
                      status: ApplePaySession.STATUS_FAILURE,
                      errors: [
                        new ApplePayError(
                          'unknown',
                          undefined,
                          'Failed to submit payment. Please try again.',
                        ),
                      ],
                    });
                    toast.error('Failed to submit receipt, check logs');
                    logJSON.error('Submit Receipt', error);
                  }
                };

                session.begin();
              }}
            >
              Pay with Fixed Native Data
            </AppleButton>
          </div>

          <ConfigurationForm
            initialConfiguration={config}
            onUpdate={setConfig}
          />
        </div>
      </section>

      <Dialog
        open={recoveryError !== null}
        onOpenChange={open => {
          if (!open) setRecoveryError(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Payment failed</DialogTitle>
            <DialogDescription>{recoveryError}</DialogDescription>
          </DialogHeader>
          <AppleButton onClick={startDialogRecoverySession}>
            Retry with Apple Pay
          </AppleButton>
        </DialogContent>
      </Dialog>
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
      {(!initialConfiguration.apiKey || !initialConfiguration.publicApiKey) && (
        <p className="text-sm text-muted-foreground">
          Enter your API keys to load Apple Pay.
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
            if (!apiKey || !publicApiKey) {
              toast.error('Please set both API keys.');
              return;
            }
            localStorage.setItem('apple-pay-apiKey', apiKey);
            localStorage.setItem('apple-pay-publicApiKey', publicApiKey);
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
