import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { type Method } from '@moneyhash/js-sdk/headless';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import NavBar from '../components/navbar';
import useShoppingCart from '../store/useShoppingCart';
import twoFixedDigit from '../utils/twoFixedDigits';
import useMoneyHash from '../hooks/useMoneyHash';
import createIntent from '../api/createIntent';
import useCurrency from '../store/useCurrency';
import formatCurrency from '../utils/formatCurrency';
import TestCardsPanel from '../components/testCardsPanel';
import useJsonConfig from '../store/useJsonConfig';

export default function Checkout() {
  const [intentId, setIntentId] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<Method[] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const navigate = useNavigate();
  const currency = useCurrency(state => state.currency);
  const cart = useShoppingCart(state => state.cart);
  const emptyCart = useShoppingCart(state => state.emptyCart);
  const jsonConfig = useJsonConfig(state => state.jsonConfig);
  const moneyHash = useMoneyHash({
    onComplete: ({ intent, redirect }) => {
      emptyCart();
      if (redirect?.redirectUrl) {
        window.location.href = redirect.redirectUrl;
        return;
      }
      navigate(`/checkout/order?intent_id${intent.id}`, { replace: true });
    },
    onFail: ({ intent }) => navigate(`/checkout/order?intent_id=${intent.id}`),
  });
  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (acc, product) =>
          acc + twoFixedDigit(product.quantity * product.price[currency]),
        0,
      ),
    [cart, currency],
  );

  const handleSubmit = async (data: FormValues) => {
    const extraConfig = jsonConfig ? JSON.parse(jsonConfig) : {};

    return createIntent({
      amount: totalPrice,
      currency,
      billing_data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
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
        category: 'Electronics',
        subcategory: 'Audio',
        type: 'Digital',
      })),
      extraConfig,
    })
      .then(async intent => {
        const { paymentMethods } = await moneyHash.getIntentMethods(
          intent.data.id,
        );
        setIntentId(intent.data.id);
        setPaymentMethods(paymentMethods);
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

  useEffect(() => {
    if (!selectedMethod) return;
    moneyHash.renderForm({
      intentId,
      selector: '#moneyhash-iframe',
    });
  }, [selectedMethod, intentId, moneyHash]);

  return (
    <div className="min-h-full flex flex-col">
      <NavBar hideCurrency hideCart />
      <TestCardsPanel />

      <div className="flex-1 flex flex-col">
        {/* Background color split screen for large screens */}
        <div
          className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
          aria-hidden="true"
        />
        <div
          className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16 flex-1 w-full">
          <h1 className="sr-only">Checkout</h1>

          <section
            aria-labelledby="summary-heading"
            className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
          >
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>

              <ul className="divide-y divide-white divide-opacity-10 text-sm font-medium">
                {cart.map(product => (
                  <li
                    key={product.id}
                    className="flex items-start space-x-4 py-6"
                  >
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-20 w-20 flex-none rounded-md object-cover object-center"
                    />
                    <div className="flex-auto space-y-1">
                      <h3 className="text-white">{product.name}</h3>
                      <p>{product.description}</p>
                      <p>Qty {product.quantity}</p>
                    </div>
                    <p className="flex-none text-base font-medium text-white">
                      {formatCurrency({
                        currency,
                        amount: twoFixedDigit(
                          product.price[currency] * product.quantity,
                        ),
                      })}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  {formatCurrency({
                    currency,
                    amount: totalPrice,
                  })}
                </dd>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="payment-and-shipping-heading"
            className="py-16 pb-36 px-4 lg:px-0 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
          >
            {!paymentMethods && <InfoForm onSubmit={handleSubmit} />}
            {paymentMethods && !selectedMethod && (
              <>
                <h3 className="text-lg font-medium text-gray-900">
                  Payment method
                </h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      disabled={isPaying}
                      className="group rounded-lg bg-slate-200/50 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 p-0.5 focus:bg-gradient-to-r focus:from-indigo-500 focus:via-purple-500 focus:to-pink-500 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                      aria-label={`Pay with ${method.title}`}
                      onClick={async () => {
                        setIsPaying(true);
                        try {
                          const { state } = await moneyHash.proceedWith({
                            type: 'method',
                            intentId,
                            id: method.id,
                          });

                          if (state !== 'INTENT_FORM') {
                            emptyCart();
                            navigate(`/checkout/order/${intentId}`, {
                              replace: true,
                            });
                            return;
                          }
                          setSelectedMethod(method);
                        } catch (error) {
                          toast.error('Something went wrong, please try again');
                        }
                        setIsPaying(false);
                      }}
                    >
                      <div className="relative flex items-center gap-3 bg-white py-2 px-3 rounded-md group-hover:bg-slate-50">
                        <span className="font-medium text-slate-800">
                          {method.title}
                        </span>
                        <img
                          src={method.icons[0]}
                          alt={method.title}
                          className="w-[34px] h-6"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
            {paymentMethods && selectedMethod && (
              <div className="h-full">
                <button
                  type="button"
                  className="relative z-10 flex items-center space-x-1 text-sm font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
                  onClick={() => {
                    setSelectedMethod(null);
                  }}
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Select different payment method</span>
                </button>
                <div
                  id="moneyhash-iframe"
                  className="w-full h-full min-h-[800px] [&_iframe]:bg-white relative -top-10"
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

type FormValues = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
};

function InfoForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'example@email.com',
      phone_number: '+201064610000',
      city: 'Nasr City',
      postal_code: '11828',
      state: 'Cairo',
      address: 'Ahmed Fakhry street, Building 22',
    },
  });

  return (
    <>
      <h2 id="payment-and-shipping-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
          <div>
            <h3
              id="contact-info-heading"
              className="text-lg font-medium text-gray-900"
            >
              Contact information
            </h3>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('first_name', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('last_name', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone_number"
                    autoComplete="tel"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('phone_number', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('email', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">
              Shipping address
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('address', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('city', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="state"
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('state', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postal_code"
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register('postal_code', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className={clsx(
                'rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50',
                isSubmitting && 'opacity-50 cursor-progress',
              )}
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
