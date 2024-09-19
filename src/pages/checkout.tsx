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

export default function Checkout() {
  const [paymentMethods, setPaymentMethods] = useState<Method[] | null>(null);
  const [expressMethods, setExpressMethods] = useState<Method[] | null>(null);
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);

  const navigate = useNavigate();
  const currency = useCurrency(state => state.currency);
  const jsonConfig = useJsonConfig(state => state.jsonConfig);
  const cart = useShoppingCart(state => state.cart);
  const totalPrice = useTotalPrice();

  const handleSubmit = async (data: InfoFormValues) => {
    const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};

    return createIntent({
      amount: totalPrice,
      currency,
      billing_data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
      },
      shipping_data: {
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
      },
      product_items: cart.map(product => ({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        amount: product.price[currency],
        // category: 'Electronics',
        // subcategory: 'Audio',
        // type: 'Digital',
        // tax: 1,
        // sku: '00000',
      })),
      extraConfig,
    })
      .then(async intent => {
        const [intentDetails, { paymentMethods, expressMethods }] =
          await Promise.all([
            moneyHash.getIntentDetails(intent.data.id),
            moneyHash.getIntentMethods(intent.data.id),
          ]);
        setIntentDetails(intentDetails);
        setPaymentMethods(paymentMethods);
        setExpressMethods(expressMethods);
      })
      .catch(err => {
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
            {!(paymentMethods || intentDetails) && (
              <InfoForm onSubmit={handleSubmit} />
            )}

            {paymentMethods && intentDetails && (
              <PaymentForm
                intentDetails={intentDetails}
                onIntentDetailsChange={setIntentDetails}
                methods={paymentMethods}
                expressMethods={expressMethods}
                onApplePayClick={async ({ onCancel, onError }) => {
                  moneyHash.payWithApplePay({
                    intentId: intentDetails.intent.id,
                    amount: totalPrice,
                    currency,
                    countryCode: 'AE',
                    onCancel,
                    onComplete: () => {
                      navigate(
                        `/checkout/order?intent_id=${intentDetails.intent.id}`,
                        {
                          replace: true,
                        },
                      );
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
