import { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { type Method } from '@moneyhash/js-sdk/headless';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';

import NavBar from '../components/navbar';
import useShoppingCart from '../store/useShoppingCart';
import twoFixedDigit from '../utils/twoFixedDigits';
import useMoneyHash from '../hooks/useMoneyHash';
import createIntent from '../api/createIntent';
import useCurrency from '../store/useCurrency';
import formatCurrency from '../utils/formatCurrency';
import PaymentExperiencePanel from '../components/paymentExperiencePanel';
import AccordionSteps from '../components/accordion';
import usePaymentExperience from '../store/usePaymentExperience';
import usePaymentOperation from '../store/usePaymentOperation';

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

type ShippingMethod = 'delivery' | 'pick-up';

export default function Checkout() {
  const [intentId, setIntentId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<Method[] | null>(null);
  const [expressMethods, setExpressMethods] = useState<Method[] | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState('0');
  const [formValues, setFormValues] = useState<FormValues>({
    first_name: 'John',
    last_name: 'Doe',
    email: 'example@email.com',
    phone_number: '+201064610000',
    city: 'Nasr City',
    postal_code: '11828',
    state: 'Cairo',
    address: 'Ahmed Fakhry street, Building 22',
  });
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>('delivery');

  const currency = useCurrency(state => state.currency);
  const cart = useShoppingCart(state => state.cart);
  const paymentExperience = usePaymentExperience(state => state.experience);
  const paymentOperation = usePaymentOperation(state => state.operation);
  const emptyCart = useShoppingCart(state => state.emptyCart);
  const navigate = useNavigate();

  const moneyHash = useMoneyHash();

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (acc, product) =>
          acc + twoFixedDigit(product.quantity * product.price[currency]),
        0,
      ),
    [cart, currency],
  );

  const handleCreateIntent = async (data: FormValues) => {
    const intent = await createIntent({
      operation: paymentOperation,
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
      })),
      hide_amount_sidebar: true,
      hide_navigation_to_payment_methods: true,
      ...(paymentExperience === 'redirect' && {
        successful_redirect_url: `${window.location.origin}/checkout/order`,
        failed_redirect_url: `${window.location.origin}/checkout/order`,
        pending_external_action_redirect_url: `${window.location.origin}/checkout/order`,
        back_url: `${window.location.origin}/checkout/order`,
      }),
    });
    const { paymentMethods, expressMethods } = await moneyHash.getIntentMethods(
      intent.data.id,
    );

    setIntentId(intent.data.id);
    setExpressMethods(expressMethods);
    setPaymentMethods(paymentMethods);
  };

  return (
    <div className="min-h-full flex flex-col">
      <NavBar hideCurrency hideCart />
      <PaymentExperiencePanel />

      <div className="flex-1 flex flex-col">
        {/* Background color split screen for large screens */}
        <div
          className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
          aria-hidden="true"
        />
        <div
          className="fixed right-0 top-0 hidden h-full w-1/2 bg-decathlon-dark lg:block"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16 flex-1 w-full">
          <h1 className="sr-only">Checkout</h1>

          <section
            aria-labelledby="summary-heading"
            className="bg-decathlon-dark py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
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
            <AccordionSteps value={activeStep} onChange={setActiveStep}>
              <AccordionSteps.Step
                stepIndex={0}
                activeStep={+activeStep}
                title="Personal Information"
              >
                <PersonalInformationForm
                  defaultValues={formValues}
                  onSubmit={values => {
                    setFormValues(prevValues => ({ ...prevValues, ...values }));
                    setActiveStep('1');
                  }}
                />
              </AccordionSteps.Step>

              <AccordionSteps.Step
                stepIndex={1}
                activeStep={+activeStep}
                title="Address"
              >
                <AddressForm
                  defaultValues={formValues}
                  onSubmit={values => {
                    setFormValues(prevValues => ({ ...prevValues, ...values }));
                    setActiveStep('2');
                  }}
                />
              </AccordionSteps.Step>

              <AccordionSteps.Step
                stepIndex={2}
                activeStep={+activeStep}
                title="Shipping Method"
              >
                <ShippingMethodForm
                  defaultValues={{ shippingMethod }}
                  onSubmit={async ({ shippingMethod }) => {
                    setShippingMethod(shippingMethod);
                    await handleCreateIntent(formValues);
                    setActiveStep('3');
                  }}
                />
              </AccordionSteps.Step>

              <AccordionSteps.Step
                stepIndex={3}
                activeStep={+activeStep}
                title="Payment"
              >
                {expressMethods?.map(method => (
                  <button
                    type="button"
                    key={method.id}
                    className={`${
                      method.id === 'APPLE_PAY'
                        ? 'bg-black'
                        : 'border border-gray-300 py-2'
                    } 
                    w-full flex justify-center rounded-md hover:opacity-90 my-4`}
                    onClick={() => {
                      moneyHash.payWithApplePay({
                        intentId,
                        amount: totalPrice,
                        currency,
                        countryCode: 'AE',
                        onCancel: () => {},
                        onComplete: () => {
                          emptyCart();
                          navigate(`/checkout/order?intent_id=${intentId}`, {
                            replace: true,
                          });
                        },
                        onError: () => {
                          navigate(`/checkout/order?intent_id=${intentId}`, {
                            replace: true,
                          });
                        },
                      });
                    }}
                  >
                    <img src={method.icons[0]} alt="" className="h-10 w-10" />
                    <p className="sr-only">{method.title}</p>
                  </button>
                ))}
                {paymentExperience === 'redirect' ? (
                  <PaymentFormRedirectExperience
                    intentId={intentId}
                    methods={paymentMethods!}
                    selectedMethodId={selectedMethodId}
                    onChange={async methodId => {
                      setSelectedMethodId(methodId);
                      await moneyHash.proceedWith({
                        type: 'method',
                        id: methodId,
                        intentId,
                      });
                    }}
                  />
                ) : (
                  <PaymentFormInAppExperience
                    intentId={intentId}
                    methods={paymentMethods!}
                    selectedMethodId={selectedMethodId}
                    onChange={async methodId => {
                      setSelectedMethodId(methodId);
                      await moneyHash.proceedWith({
                        type: 'method',
                        id: methodId,
                        intentId,
                      });
                    }}
                  />
                )}
              </AccordionSteps.Step>
            </AccordionSteps>
          </section>
        </div>
      </div>
    </div>
  );
}

function PersonalInformationForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: FormValues) => void;
  defaultValues: Partial<FormValues> | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-2">
      <div className="grid md:grid-cols-2 gap-4">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
              {...register('email', { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          type="submit"
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50',
            isSubmitting && 'opacity-50 cursor-progress',
          )}
          disabled={isSubmitting}
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

function AddressForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: FormValues) => void;
  defaultValues: Partial<FormValues> | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-2">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-decathlon focus:ring-decathlon sm:text-sm"
              {...register('postal_code', { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          type="submit"
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50',
            isSubmitting && 'opacity-50 cursor-progress',
          )}
          disabled={isSubmitting}
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

function ShippingMethodForm({
  onSubmit,
  defaultValues,
}: {
  defaultValues: { shippingMethod: ShippingMethod };
  onSubmit: (data: { shippingMethod: ShippingMethod }) => void;
}) {
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<{
    shippingMethod: ShippingMethod;
  }>({
    shouldUnregister: true,
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-2">
      <div className="flex items-center space-x-2">
        <input
          id="delivery"
          type="radio"
          value="delivery"
          className="text-decathlon focus:ring-decathlon w-4 h-4"
          {...register('shippingMethod', { required: true })}
        />
        <label htmlFor="delivery" className="block font-medium text-gray-700">
          Home delivery
        </label>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <input
          id="pick-up"
          type="radio"
          value="pick-up"
          className="text-decathlon focus:ring-decathlon w-4 h-4"
          {...register('shippingMethod', { required: true })}
        />
        <label htmlFor="pick-up" className="block font-medium text-gray-700">
          Pick-up in store
        </label>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50',
            isSubmitting && 'opacity-50 cursor-progress',
          )}
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

function PaymentFormInAppExperience({
  intentId,
  methods,
  selectedMethodId,
  onChange,
}: {
  methods: Method[];
  intentId: string;
  selectedMethodId: string | null;
  onChange: (methodId: string) => void;
}) {
  const [view, setView] = useState<'select-method' | 'checkout-form'>(
    'select-method',
  );
  const [isChangingMethod, setIsChangingMethod] = useState(false);
  const currency = useCurrency(state => state.currency);

  if (view === 'select-method') {
    return (
      <>
        <RadioGroup
          dir={currency === 'EGP' ? 'rtl' : 'ltr'}
          value={selectedMethodId}
          onChange={async methodId => {
            if (!methodId) return;
            setIsChangingMethod(true);
            try {
              await onChange(methodId);
              setIsChangingMethod(false);
            } catch (error) {
              setIsChangingMethod(false);
            }
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2.5">
            {methods.map(method => (
              <RadioGroup.Option
                key={method.title}
                value={method.id}
                className={({ active }) =>
                  clsx(
                    active
                      ? 'border-decathlon ring-2 ring-decathlon/30'
                      : 'border-gray-300',
                    'relative block cursor-pointer rounded-lg border bg-white px-4 py-3 shadow-sm focus:outline-none sm:flex sm:justify-between',
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        id={method.id}
                        type="radio"
                        className="text-decathlon focus:ring-decathlon w-4 h-4"
                        checked={method.id === selectedMethodId}
                        onChange={() => {}}
                      />

                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900 text-sm"
                      >
                        {method.title}
                      </RadioGroup.Label>
                    </div>
                    <img
                      src={method.icons[0]}
                      alt=""
                      className="object-contain h-8 w-8"
                    />
                    <span
                      className={clsx(
                        active ? 'border' : 'border-2',
                        checked ? 'border-decathlon' : 'border-transparent',
                        'pointer-events-none absolute -inset-px rounded-lg',
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
        <button
          type="button"
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50 disabled:pointer-events-none disabled:opacity-50 mt-10',
          )}
          disabled={!selectedMethodId || isChangingMethod}
          onClick={() => setView('checkout-form')}
        >
          Complete Order
        </button>
      </>
    );
  }

  return (
    <div className="py-4">
      <button
        type="button"
        className="relative z-10 flex items-center space-x-1 text-sm font-medium text-decathlon-dark underline underline-offset-2 hover:text-decathlon"
        onClick={() => setView('select-method')}
      >
        <span>Select different payment method</span>
      </button>

      {selectedMethodId === 'PAY_FLEX' ? (
        <PayFlexModal intentId={intentId} />
      ) : (
        <CheckoutForm intentId={intentId} />
      )}
    </div>
  );
}

function PayFlexModal({ intentId }: { intentId: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const emptyCart = useShoppingCart(state => state.emptyCart);

  const moneyHash = useMoneyHash({
    onComplete: ({ intent }) => {
      emptyCart();
      navigate(`/checkout/order?intent_id=${intent.id}`, { replace: true });
    },
    onFail: ({ intent }) => navigate(`/checkout/order?intent_id=${intent.id}`),
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        moneyHash.renderForm({ selector: '#moneyHash-iframe', intentId });
      }, 100);
    }
  }, [isOpen, moneyHash, intentId]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/80 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="bg-white inline-block overflow-y-auto rounded-lg px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle relative z-10">
              <div
                id="moneyHash-iframe"
                className="w-full h-[1000px] [&_iframe]:bg-white relative"
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function CheckoutForm({ intentId }: { intentId: string }) {
  const navigate = useNavigate();
  const emptyCart = useShoppingCart(state => state.emptyCart);

  const moneyHash = useMoneyHash({
    onComplete: ({ intent }) => {
      emptyCart();
      navigate(`/checkout/order?intent_id=${intent.id}`, { replace: true });
    },
    onFail: ({ intent }) => navigate(`/checkout/order?intent_id=${intent.id}`),
  });

  useEffect(() => {
    moneyHash.renderForm({ selector: '#moneyHash-iframe', intentId });
  }, [moneyHash, intentId]);

  return (
    <div
      id="moneyHash-iframe"
      className="w-full h-[800px] [&_iframe]:bg-white relative"
    />
  );
}

function PaymentFormRedirectExperience({
  intentId,
  methods,
  selectedMethodId,
  onChange,
}: {
  methods: Method[];
  intentId: string;
  selectedMethodId: string | null;
  onChange: (methodId: string) => void;
}) {
  const [isChangingMethod, setIsChangingMethod] = useState(false);
  const currency = useCurrency(state => state.currency);

  return (
    <div className="py-4">
      <RadioGroup
        dir={currency === 'EGP' ? 'rtl' : 'ltr'}
        value={selectedMethodId}
        onChange={async methodId => {
          if (!methodId) return;
          setIsChangingMethod(true);
          try {
            await onChange(methodId);
            setIsChangingMethod(false);
          } catch (error) {
            setIsChangingMethod(false);
          }
        }}
      >
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="space-y-2.5">
          {methods.map(method => (
            <RadioGroup.Option
              key={method.title}
              value={method.id}
              className={({ active }) =>
                clsx(
                  active
                    ? 'border-decathlon ring-2 ring-decathlon/30'
                    : 'border-gray-300',
                  'relative block cursor-pointer rounded-lg border bg-white px-4 py-3 shadow-sm focus:outline-none sm:flex sm:justify-between',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      id={method.id}
                      type="radio"
                      className="text-decathlon focus:ring-decathlon w-4 h-4"
                      checked={method.id === selectedMethodId}
                      onChange={() => {}}
                    />

                    <RadioGroup.Label
                      as="span"
                      className="font-medium text-gray-900 text-sm"
                    >
                      {method.title}
                    </RadioGroup.Label>
                  </div>
                  <img
                    src={method.icons[0]}
                    alt=""
                    className="object-contain h-8 w-8"
                  />
                  <span
                    className={clsx(
                      active ? 'border' : 'border-2',
                      checked ? 'border-decathlon' : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-lg',
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="mt-10">
        <a
          href={`https://stg-embed.moneyhash.io/embed/payment/${intentId}`}
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50',
            (!selectedMethodId || isChangingMethod) &&
              'pointer-events-none opacity-50',
          )}
        >
          Complete Order
        </a>
      </div>
    </div>
  );
}
