import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type IntentDetails,
  type Method,
  type Card,
} from '@moneyhash/js-sdk/headless';
import toast from 'react-hot-toast';

import NavBar from '@/components/navbar';
import useShoppingCart, { useTotalPrice } from '@/store/useShoppingCart';
import { moneyHash } from '@/utils/moneyHash';
import createIntent from '@/api/createIntent';
import useCurrency from '@/store/useCurrency';
import TestCardsPanel from '@/components/testCardsPanel';
import useJsonConfig from '@/store/useJsonConfig';

import {
  InfoForm,
  type InfoFormValues,
  OrderSummaryPanel,
} from '@/components/checkout';
import { PaymentForm } from '@/components/checkout/paymentForm';
import { logJSON } from '@/utils/logJSON';

export default function Checkout() {
  const [paymentMethods, setPaymentMethods] = useState<Method[] | null>(null);
  const [expressMethods, setExpressMethods] = useState<Method[] | null>(null);
  const [savedCards, setSavedCards] = useState<Card[] | null>(null);
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);
  const [userInfo, setUserInfo] = useState<InfoFormValues | null>(null);

  const navigate = useNavigate();
  const currency = useCurrency(state => state.currency);
  const jsonConfig = useJsonConfig(state => state.jsonConfig);
  const cart = useShoppingCart(state => state.cart);
  const totalPrice = useTotalPrice();

  const handleCreateIntent = async ({
    methodId,
    userInfo,
    disableIntentDetails = false,
  }: {
    userInfo: InfoFormValues;
    methodId?: string;
    disableIntentDetails?: boolean;
  }) => {
    const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};

    let intentId;
    try {
      const response = await createIntent({
        methodId,
        amount: totalPrice,
        currency,
        userInfo,
        product_items: cart.map((product, index) => ({
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          amount: product.price[currency],
          category: 'Electronics',
          subcategory: 'Audio',
          type: 'Digital',
          sku: `sku${index}`,
          tax: 1,
        })),
        extraConfig,
      });
      intentId = response.data.id;
      logJSON.BE('Create Intent', response);
    } catch (error: any) {
      const [key, message] =
        Object.entries(error.response.data.status.errors[0] || {})[0] || [];
      if (key) {
        toast.error(`${key}: ${message}`);
      } else {
        toast.error((message as string) || 'Something went wrong');
      }

      return Promise.reject(error);
    }

    if (disableIntentDetails) {
      return intentId;
    }

    return moneyHash
      .getIntentDetails(intentId)
      .then(response => {
        logJSON.response('getIntentDetails', response);
        setIntentDetails(response);
        return response.intent.id;
      })
      .catch(err => {
        logJSON.error('getIntentDetails', err);
        toast.error('Something went wrong, please try again');
        return Promise.reject(err);
      });
  };

  const handleSelectMethod = async (methodId: string) => {
    if (!userInfo) return;
    // Create a new intent if it doesn't exist
    if (!intentDetails) {
      return handleCreateIntent({ methodId, userInfo });
    }

    return moneyHash
      .proceedWith({
        intentId: intentDetails.intent.id,
        id: methodId,
        type: 'method',
      })
      .then(response => {
        setIntentDetails(response);
        logJSON.response('proceedWith', response);
      })
      .catch(error => {
        logJSON.error('proceedWith', error);
        toast.error('Something went wrong, please try again');
      });
  };

  const handlePayWithSavedCard = async ({
    cardId,
    cvv,
  }: {
    cardId: string;
    cvv: string;
  }) => {
    if (!userInfo) return;

    const intentId =
      intentDetails?.intent.id ||
      (await handleCreateIntent({ userInfo, disableIntentDetails: true }));

    try {
      const intentDetails = await moneyHash.proceedWith({
        type: 'savedCard',
        id: cardId,
        metaData: {
          cvv,
        },
        intentId,
      });
      logJSON.response('proceedWith:savedCard', intentDetails);
      setIntentDetails(intentDetails);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleSubmit = async (data: InfoFormValues) => {
    setUserInfo(data);
  };

  useEffect(() => {
    if (!userInfo) return;
    async function fetchMethods() {
      const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};

      try {
        const purchaseResponse = await moneyHash.getMethods({
          currency,
          amount: totalPrice,
          flowId: extraConfig.flow_id,
          customer: extraConfig.customer,
          customFields: extraConfig.custom_fields,
          operation: 'purchase',
        });
        const {
          paymentMethods: purchaseMethods,
          expressMethods,
          savedCards,
        } = purchaseResponse;
        logJSON.response('getMethods: Operation (Purchase)', purchaseResponse);

        const authorizeResponse = await moneyHash.getMethods({
          currency,
          amount: totalPrice,
          flowId: extraConfig.flow_id,
          customer: extraConfig.customer,
          customFields: extraConfig.custom_fields,
          operation: 'authorize',
        });
        const { paymentMethods: authorizeMethods } = authorizeResponse;
        logJSON.response(
          'getMethods: Operation (Authorize)',
          authorizeResponse,
        );

        setPaymentMethods(
          purchaseMethods.concat(
            authorizeMethods.filter(
              method => !purchaseMethods.some(m => m.id === method.id),
            ),
          ),
        );
        setExpressMethods(
          expressMethods.filter(method => method.id !== 'GOOGLE_PAY'),
        );
        setSavedCards(savedCards);
      } catch (error: any) {
        logJSON.error('getMethods', error);
        const [key, message] =
          Object.entries(error.response.data.status.errors[0] || {})[0] || [];
        if (key) {
          toast.error(`${key}: ${message}`);
        } else {
          toast.error((message as string) || 'Something went wrong');
        }
      }
    }

    fetchMethods();
  }, [userInfo, currency, jsonConfig, totalPrice]);

  return (
    <div className="min-h-full flex flex-col">
      <NavBar hideCurrency={!!intentDetails} hideCart={!!intentDetails} />
      <TestCardsPanel />

      <div className="flex-1 flex flex-col">
        {/* Background color split screen for large screens */}
        <div
          className="fixed left-0 top-0 hidden h-full w-1/2 bg-background lg:block"
          aria-hidden="true"
        />
        <div
          className="fixed right-0 top-0 hidden h-full w-1/2 bg-accent lg:block"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16 flex-1 w-full">
          <h1 className="sr-only">Checkout</h1>

          <OrderSummaryPanel
            cart={cart}
            currency={currency}
            totalPrice={totalPrice}
          />

          <section
            aria-labelledby="payment-and-shipping-heading"
            className="py-16 pb-36 px-4 lg:px-0 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
          >
            {!userInfo && <InfoForm onSubmit={handleSubmit} />}

            {userInfo && paymentMethods && (
              <PaymentForm
                intentDetails={intentDetails}
                onIntentDetailsChange={setIntentDetails}
                methods={paymentMethods}
                expressMethods={expressMethods}
                savedCards={savedCards}
                onSelectMethod={handleSelectMethod}
                onPayWithSavedCard={handlePayWithSavedCard}
                onApplePayClick={async ({ onCancel, onError }) => {
                  const applePayNativeData = expressMethods?.find(
                    method => method.id === 'APPLE_PAY',
                  )?.nativePayData!;
                  let intentId: string;

                  const session = new ApplePaySession(3, {
                    countryCode: applePayNativeData.country_code,
                    currencyCode: applePayNativeData.currency_code,
                    supportedNetworks: applePayNativeData.supported_networks,
                    merchantCapabilities: ['supports3DS'],
                    total: {
                      label: 'Apple Pay',
                      type: 'final',
                      amount: `${applePayNativeData.amount}`,
                    },
                    requiredShippingContactFields: ['email'],
                  });

                  session.onvalidatemerchant = e =>
                    moneyHash
                      .validateApplePayMerchantSession({
                        methodId: applePayNativeData.method_id,
                        validationUrl: e.validationURL,
                      })
                      .then(merchantSession =>
                        session.completeMerchantValidation(merchantSession),
                      )
                      .catch(() => {
                        session.completeMerchantValidation({});
                        onError();
                        toast.error('Something went wrong, please try again!');
                      });

                  session.onpaymentauthorized = async e => {
                    const applePayReceipt = {
                      receipt: JSON.stringify({ token: e.payment.token }),
                      receiptBillingData: {
                        email: e.payment.shippingContact?.emailAddress,
                      },
                    };
                    session.completePayment(ApplePaySession.STATUS_SUCCESS);

                    await moneyHash.proceedWith({
                      type: 'method',
                      id: 'APPLE_PAY',
                      intentId,
                    });

                    await moneyHash.submitPaymentReceipt({
                      nativeReceiptData: applePayReceipt,
                      intentId,
                    });

                    navigate(`/checkout/order?intent_id=${intentId}`, {
                      replace: true,
                    });
                  };

                  if (!intentDetails) {
                    intentId = await handleCreateIntent({
                      userInfo,
                    });
                  } else {
                    intentId = intentDetails.intent.id;
                  }
                  session.oncancel = onCancel;
                  session.begin();
                }}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
