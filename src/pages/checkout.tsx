/* eslint-disable */

import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { type Method } from '@moneyhash/js-sdk/headless';
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import GooglePayButton from '@google-pay/button-react';

import NavBar from '../components/navbar';
import { useShoppingCart } from '../store/useShoppingCart';
import useMoneyHash from '../hooks/useMoneyHash';
import createIntent from '../api/createIntent';
import useCurrency from '../store/useCurrency';
import PaymentExperiencePanel from '../components/paymentExperiencePanel';
import usePaymentExperience from '../store/usePaymentExperience';
import Input from '../components/input';
import Button from '../components/button';
import getTicketPrice from '../utils/getTicketPrice';
import Ticket from '../components/ticket';
import cn from '../utils/cn';

type FormValues = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

export default function Checkout() {
  const [intentId, setIntentId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<Method[] | null>(null);
  const [expressMethods, setExpressMethods] = useState<Method[] | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<FormValues | null>(null);
  const currency = useCurrency(state => state.currency);
  const ticketInfo = useShoppingCart(state => state.selectedTicket);
  const paymentExperience = usePaymentExperience(state => state.experience);
  const navigate = useNavigate();

  const moneyHash = useMoneyHash();

  if (!ticketInfo) {
    return <Navigate to="/" />;
  }

  const totalPrice = getTicketPrice({
    classOption: ticketInfo.classOption,
    ticketPrice: ticketInfo.price[currency],
    passengers: +ticketInfo.passengers,
  });

  const handleCreateIntent = async (data: FormValues) => {
    const intent = await createIntent({
      amount: totalPrice,
      currency,
      billing_data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
      },
      product_items: [
        {
          name: ticketInfo.classOption,
          amount: totalPrice,
          quantity: 1,
          description: JSON.stringify(ticketInfo),
        },
      ],
      hide_amount_sidebar: true,
      hide_navigation_to_payment_methods: true,
      ...{
        successful_redirect_url: `${window.location.origin}/checkout/order`,
        failed_redirect_url: `${window.location.origin}/checkout/order`,
        pending_external_action_redirect_url: `${window.location.origin}/checkout/order`,
        back_url: `${window.location.origin}/checkout/order`,
      },
    });
    const { paymentMethods, expressMethods } = await moneyHash.getIntentMethods(
      intent.data.id,
    );
    setIntentId(intent.data.id);
    setExpressMethods(expressMethods);
    setPaymentMethods(paymentMethods);
    setPersonalInfo(data);
  };

  return (
    <div className="min-h-full flex flex-col">
      <NavBar hideCurrency />
      <PaymentExperiencePanel />

      <div className="flex-1 flex flex-col">
        {/* Background color split screen for large screens */}
        <div
          className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
          aria-hidden="true"
        />
        <div
          className="fixed right-0 top-0 hidden h-full w-1/2 bg-primary-dark lg:block"
          aria-hidden="true"
        />
        <h1 className="sr-only">Checkout</h1>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16 flex-1 w-full">
          <section
            aria-labelledby="summary-heading"
            className="bg-primary-dark py-10  md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 flex justify-center "
          >
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0 w-full">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>
              <Ticket {...ticketInfo} date={ticketInfo.dates.from!} />
            </div>
          </section>
          <section className="py-16 pb-36 px-4 lg:px-0 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-4">
            {!intentId ? (
              <>
                <h2 className="text-lg font-medium mb-2">
                  Personal Information
                </h2>
                <PersonalInformationForm onSubmit={handleCreateIntent} />
              </>
            ) : paymentExperience === 'redirect' ? (
              <PaymentFormRedirectExperience
                intentId={intentId}
                methods={paymentMethods!}
                selectedMethodId={selectedMethodId}
                onChange={async methodId => {
                  setSelectedMethodId(methodId);
                  await moneyHash
                    .proceedWith({
                      type: 'method',
                      id: methodId,
                      intentId,
                    })
                    .catch(() => {
                      toast.error('Something went wrong, please try again');
                      setSelectedMethodId(null);
                    });
                }}
                expressMethods={expressMethods}
                onApplePayClick={async () => {
                  moneyHash.payWithApplePay({
                    intentId,
                    amount: totalPrice,
                    currency,
                    countryCode: 'AE',
                    onCancel: () => {},
                    onComplete: () => {
                      navigate(`/checkout/order?intent_id=${intentId}`, {
                        replace: true,
                      });
                    },
                    onError: () => {
                      navigate(`/checkout/order?intent_id=${intentId}`, {
                        replace: true,
                      });
                    },
                    billingData: personalInfo!,
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
                  await moneyHash
                    .proceedWith({
                      type: 'method',
                      id: methodId,
                      intentId,
                    })
                    .catch(() => {
                      toast.error('Something went wrong, please try again');
                      setSelectedMethodId(null);
                    });
                }}
                expressMethods={expressMethods}
                onApplePayClick={async () => {
                  moneyHash.payWithApplePay({
                    intentId,
                    amount: totalPrice,
                    currency,
                    countryCode: 'AE',
                    onCancel: () => {},
                    onComplete: () => {
                      navigate(`/checkout/order?intent_id=${intentId}`, {
                        replace: true,
                      });
                    },
                    onError: () => {
                      navigate(`/checkout/order?intent_id=${intentId}`, {
                        replace: true,
                      });
                    },
                    billingData: personalInfo!,
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

function PersonalInformationForm({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'example@email.com',
      phone_number: '+201064610000',
    },
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
            <Input
              id="first_name"
              autoComplete="given-name"
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
            <Input
              id="last_name"
              autoComplete="family-name"
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
            <Input
              type="tel"
              id="phone_number"
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
            <Input
              type="email"
              id="email"
              autoComplete="email"
              {...register('email', { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Button
          type="submit"
          className={cn('w-full', isSubmitting && 'opacity-50 cursor-progress')}
          disabled={isSubmitting}
        >
          Continue to payment
        </Button>
      </div>
    </form>
  );
}

function PaymentFormInAppExperience({
  intentId,
  methods,
  expressMethods,
  selectedMethodId,
  onChange,
  onApplePayClick,
}: {
  methods: Method[];
  expressMethods?: Method[] | null;
  intentId: string;
  selectedMethodId: string | null;
  onChange: (methodId: string) => void;
  onApplePayClick: () => void;
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
          <div className="gap-3 grid grid-cols-1">
            {expressMethods?.map(method => (
              <ExpressButton
                key={method.id}
                method={method}
                isSelected={selectedMethodId === method.id}
                onClick={async () => {
                  setIsChangingMethod(true);
                  try {
                    method.id === 'APPLE_PAY'
                      ? onApplePayClick()
                      : await onChange(method.id);
                    setIsChangingMethod(false);
                  } catch (error) {
                    setIsChangingMethod(false);
                  }
                }}
              />
            ))}

            {methods.map(method => (
              <RadioGroup.Option
                key={method.title}
                value={method.id}
                className={({ active }) =>
                  cn(
                    active && 'border-primary ring-2 ring-primary/30',
                    'relative block cursor-pointer rounded-lg border bg-white px-4 py-1.5 shadow-sm focus:outline-none',
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        id={method.id}
                        type="radio"
                        className="text-primary focus:ring-primary w-4 h-4"
                        checked={method.id === selectedMethodId}
                        onChange={() => {}}
                      />

                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900 text-sm"
                      >
                        {method.title}
                      </RadioGroup.Label>
                      <img
                        src={method.icons[0]}
                        alt=""
                        className="object-contain h-8 w-8 ml-auto"
                        draggable={false}
                      />
                    </div>
                    <span
                      className={cn(
                        active ? 'border' : 'border-2',
                        checked ? 'border-primary' : 'border-transparent',
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
        <div className="mt-5">
          <Button
            type="button"
            className="w-full"
            disabled={!selectedMethodId || isChangingMethod}
            onClick={() => setView('checkout-form')}
          >
            Complete Order
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="">
      <button
        type="button"
        className="relative z-10 flex items-center space-x-1 text-sm font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
        onClick={() => setView('select-method')}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
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

  const moneyHash = useMoneyHash({
    onComplete: ({ intent }) => {
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

  const moneyHash = useMoneyHash({
    onComplete: async ({ intent, redirect }) => {
      if (redirect?.redirectUrl) {
        window.location.href = redirect.redirectUrl;
        return;
      }
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
  expressMethods,
  selectedMethodId,
  onChange,
  onApplePayClick,
}: {
  methods: Method[];
  expressMethods?: Method[] | null;
  intentId: string;
  selectedMethodId: string | null;
  onChange: (methodId: string) => void;
  onApplePayClick: () => void;
}) {
  const [isChangingMethod, setIsChangingMethod] = useState(false);
  const currency = useCurrency(state => state.currency);

  return (
    <div className="">
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
        <div className="grid grid-cols-1 gap-3">
          {expressMethods?.map(method => (
            <ExpressButton
              key={method.id}
              method={method}
              isSelected={selectedMethodId === method.id}
              onClick={async () => {
                try {
                  method.id === 'APPLE_PAY'
                    ? onApplePayClick()
                    : await onChange(method.id);
                  setIsChangingMethod(false);
                } catch (error) {
                  setIsChangingMethod(false);
                }
              }}
            />
          ))}

          {methods.map(method => (
            <RadioGroup.Option
              key={method.title}
              value={method.id}
              className={({ active }) =>
                cn(
                  active && 'border-primary ring-2 ring-primary/30',
                  'relative block cursor-pointer rounded-lg border bg-white px-4 py-1.5 shadow-sm focus:outline-none',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      id={method.id}
                      type="radio"
                      className="text-primary focus:ring-primary w-4 h-4"
                      checked={method.id === selectedMethodId}
                      onChange={() => {}}
                    />

                    <RadioGroup.Label
                      as="span"
                      className="font-medium text-gray-900 text-sm"
                    >
                      {method.title}
                    </RadioGroup.Label>
                    <img
                      src={method.icons[0]}
                      alt=""
                      className="object-contain h-8 w-8 ml-auto"
                      draggable={false}
                    />
                  </div>
                  <span
                    className={cn(
                      active ? 'border' : 'border-2',
                      checked ? 'border-primary' : 'border-transparent',
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
        <Button asChild>
          <a
            href={`https://embed.moneyhash.io/embed/payment/${intentId}`}
            className={cn(
              'w-full',
              (!selectedMethodId || isChangingMethod) &&
                'pointer-events-none opacity-50',
            )}
          >
            Complete Order
          </a>
        </Button>
      </div>
    </div>
  );
}

function ExpressButton({
  isSelected,
  method,
  onClick,
}: {
  isSelected: boolean;
  method: Method;
  onClick: () => void;
}) {
  if (method.id === 'GOOGLE_PAY') {
    return (
      <GooglePayButton
        environment="TEST"
        buttonType="pay"
        buttonColor="black"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Emirates Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '100.00',
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        buttonSizeMode="fill"
        style={{ height: 46 }}
        className={cn(
          '[&_.gpay-card-info-container]:!border [&_.gpay-card-info-container.focus]:!ring-2 [&_.gpay-card-info-container.focus]:!border-primary [&_.gpay-card-info-container.focus]:!ring-primary/30 [&_.gpay-card-info-container]:!rounded-lg',
          isSelected &&
            '[&_.gpay-card-info-container]:!border-primary [&_.gpay-card-info-container]:!ring-2 [&_.gpay-card-info-container]:!ring-primary [&_.gpay-card-info-container]:!outline-none ',
        )}
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'flex justify-center items-center rounded-lg hover:opacity-90 border h-[46px] focus:outline-none:ring-2 focus-visible:border-primary focus-visible:ring-primary/30 overflow-hidden bg-black text-white',
        isSelected && 'border-primary ring-2 ring-primary',
      )}
      onClick={onClick}
    >
      {method.id === 'APPLE_PAY' ? (
        <img
          src={method.icons[0]}
          alt=""
          className="h-full"
          draggable={false}
        />
      ) : (
        <p>
          Pay with <span className="font-medium">{method.title}</span>
        </p>
      )}
    </button>
  );
}
