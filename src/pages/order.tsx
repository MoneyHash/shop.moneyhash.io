import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { LinkItUrl } from 'react-linkify-it';
import Loader from '@/components/loader';
import NavBar from '@/components/navbar';
import { moneyHash } from '@/utils/moneyHash';
import formatCurrency from '@/utils/formatCurrency';
import { products, type Currency } from '@/utils/productSections';
import NotFound from '@/components/notFound';
import TransactionFailed from '@/components/transactionFailed';

export default function Order() {
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);
  const [error, setError] = useState();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('intent_id');

  useEffect(() => {
    if (!orderId) return;
    moneyHash.getIntentDetails(orderId).then(setIntentDetails).catch(setError);
  }, [orderId]);

  const currency = intentDetails?.intent.amount.currency! as Currency;
  const totalPrice = intentDetails?.intent.amount.formatted;

  const orderedProducts = useMemo(() => {
    if (!intentDetails?.productItems) return [];

    return intentDetails.productItems.map(productItem => {
      const product = products.find(
        product => product.name === productItem.name,
      );

      return {
        ...productItem,
        amount: formatCurrency({
          currency,
          amount: +productItem.amount,
        }),
        imageSrc: product?.imageSrc,
        imageAlt: product?.imageAlt,
      };
    });
  }, [intentDetails, currency]);

  if (error) {
    return (
      <div>
        <NavBar hideCurrency hideCart />
        <NotFound />
      </div>
    );
  }

  if (intentDetails?.paymentStatus.status === 'AUTHORIZE_ATTEMPT_FAILED') {
    return (
      <div>
        <NavBar hideCurrency hideCart />
        <TransactionFailed />
      </div>
    );
  }

  if (intentDetails?.state === 'CLOSED') {
    return (
      <div>
        <NavBar hideCurrency hideCart />
        <TransactionFailed message="Your payment was closed" />
      </div>
    );
  }

  const externalActionMessage =
    intentDetails?.transaction?.externalActionMessage || [];

  return (
    <div>
      <NavBar hideCurrency hideCart />
      {intentDetails ? (
        <div className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-base font-medium text-primary">Thank you!</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                It&apos;s on the way!
              </p>
              <div className="mt-2 text-base text-subtle">
                <p>
                  Your order #<span className="uppercase">{orderId}</span> has
                  shipped and will be with you soon.
                </p>
                {externalActionMessage?.length > 0 && (
                  <a href="#actions" className="underline text-sm text-primary">
                    Please check the actions required ↓
                  </a>
                )}
              </div>

              <dl className="mt-12 text-sm font-medium">
                <dt className="text-bolder">Tracking id</dt>
                <dd className="mt-2  text-primary dark:text-subtler">
                  {intentDetails.transaction?.id}
                </dd>
              </dl>
            </div>

            <div className="mt-10 border-t">
              <h2 className="sr-only">Your order</h2>

              <h3 className="sr-only">Items</h3>
              {orderedProducts.map(product => (
                <div
                  key={product.reference_id}
                  className="flex space-x-6 border-b py-10"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-20 w-20 flex-none rounded-lg object-cover object-center sm:h-40 sm:w-40"
                  />
                  <div className="flex flex-auto flex-col">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="mt-2 text-sm text-subtle">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-1 items-end">
                      <dl className="flex space-x-4 divide-x text-sm sm:space-x-6">
                        <div className="flex">
                          <dt className="font-medium text-subtler">Quantity</dt>
                          <dd className="ml-2 text-bolder">
                            {product.quantity}
                          </dd>
                        </div>
                        <div className="flex pl-4 sm:pl-6">
                          <dt className="font-medium text-subtler">Price</dt>
                          <dd className="ml-2 text-bolder">{product.amount}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}

              <div className="sm:ml-40 sm:pl-6">
                {externalActionMessage?.length > 0 && (
                  <div className="border-b mt-10 pb-10">
                    <h4
                      className="text-lg font-medium text-subtle mb-2 scroll-mt-20"
                      id="actions"
                    >
                      Actions required
                    </h4>
                    <ul className="list-decimal list-inside space-y-1">
                      {externalActionMessage.map(message => (
                        <li key={`${message}`}>
                          <LinkItUrl className="text-blue-600 underline hover:text-blue-500">
                            {message}
                          </LinkItUrl>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h3 className="sr-only">Your information</h3>

                <h4 className="sr-only">Addresses</h4>
                <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                  <div>
                    <dt className="font-medium text-subtle">
                      Shipping address
                    </dt>
                    <dd className="mt-2">
                      <address className="not-italic">
                        <span className="block">
                          {intentDetails.shippingData?.address}
                        </span>
                        <span className="block">
                          {intentDetails.shippingData?.city},{' '}
                          {intentDetails.shippingData?.state}
                        </span>
                      </address>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-subtle">
                      Contact Information
                    </dt>
                    <dd className="mt-2">
                      <address className="not-italic">
                        <span className="block">
                          {intentDetails.transaction?.billingData.first_name}{' '}
                          {intentDetails.transaction?.billingData.last_name}
                        </span>
                        <span className="block">
                          {intentDetails.transaction?.billingData.email}
                        </span>
                        <span className="block">
                          {intentDetails.transaction?.billingData.phone_number}
                        </span>
                      </address>
                    </dd>
                  </div>
                </dl>

                <h4 className="sr-only">Payment</h4>
                <dl className="grid grid-cols-2 gap-x-6 border-t py-10 text-sm">
                  <div>
                    <dt className="font-medium text-subtle">Payment method</dt>
                    <dd className="mt-2">
                      <p>{intentDetails.transaction?.paymentMethodName}</p>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-subtle">Shipping method</dt>
                    <dd className="mt-2">
                      <p>DHL</p>
                      <p>Takes up to 3 working days</p>
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">Summary</h3>

                <dl className="space-y-6 border-t pt-10 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-bolder">Total</dt>
                    <dd>
                      {formatCurrency({
                        currency,
                        amount: totalPrice!,
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-20">
          <Loader />
        </div>
      )}
    </div>
  );
}
