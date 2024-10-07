import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type IntentDetails, type Method } from '@moneyhash/js-sdk/headless';
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
  }: {
    userInfo: InfoFormValues;
    methodId: string;
  }) => {
    const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};

    let intentId;
    try {
      const response = await createIntent({
        methodId,
        amount: totalPrice,
        currency,
        userInfo,
        product_items: cart.map(product => ({
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          amount: product.price[currency],
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

  const handleSubmit = async (data: InfoFormValues) => {
    const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};
    return moneyHash
      .getMethods({
        currency,
        amount: totalPrice,
        flowId: extraConfig.flow_id,
      })
      .then(response => {
        logJSON.response('getMethods', response);
        const { paymentMethods, expressMethods } = response;
        setUserInfo(data);
        setPaymentMethods(paymentMethods);
        setExpressMethods(
          expressMethods.filter(method => method.id !== 'GOOGLE_PAY'),
        );
      })
      .catch(err => {
        logJSON.error('getMethods', err);
        const [key, message] =
          Object.entries(err.response.data.status.errors[0] || {})[0] || [];
        if (key) {
          toast.error(`${key}: ${message}`);
        } else {
          toast.error((message as string) || 'Something went wrong');
        }
      });
  };

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
                onSelectMethod={handleSelectMethod}
                onApplePayClick={async ({ onCancel, onError }) => {
                  let intentId: string;
                  if (!intentDetails) {
                    intentId = await handleCreateIntent({
                      userInfo,
                      methodId: 'APPLE_PAY',
                    });
                  } else {
                    intentId = intentDetails.intent.id;
                  }

                  moneyHash.payWithApplePay({
                    intentId,
                    amount: totalPrice,
                    currency,
                    countryCode: 'AE',
                    onCancel,
                    onComplete: () => {
                      navigate(`/checkout/order?intent_id=${intentId}`, {
                        replace: true,
                      });
                    },
                    onError: () => {
                      toast.error('Something went wrong, please try again!');
                      onError();
                    },
                  });
                }}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
