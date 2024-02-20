import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { LinkItUrl } from 'react-linkify-it';
import Loader from '../components/loader';
import NavBar from '../components/navbar';
import useMoneyHash from '../hooks/useMoneyHash';
import formatCurrency from '../utils/formatCurrency';
import { products, type Currency } from '../utils/productSections';
import NotFound from '../components/notFound';
import TransactionFailed from '../components/transactionFailed';
import TransactionClosed from '../components/transactionClosed';

export default function Order() {
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);
  const [error, setError] = useState();
  // const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('intent_id');
  const moneyHash = useMoneyHash();

  useEffect(() => {
    if (!orderId) return;
    moneyHash.getIntentDetails(orderId).then(setIntentDetails).catch(setError);
  }, [moneyHash, orderId]);

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

  if (intentDetails?.state === 'TRANSACTION_FAILED') {
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
        <TransactionClosed />
      </div>
    );
  }

  return (
    <div>
      <NavBar hideCurrency hideCart />
      {intentDetails ? (
        <div className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-base font-medium text-decathlon-dark">
                Thank you!
              </h1>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                It&apos;s on the way!
              </p>
              <div className="mt-2 text-base text-gray-500">
                <p>
                  Your order #<span className="uppercase">{orderId}</span> has
                  shipped and will be with you soon.
                </p>
                {intentDetails.transaction?.externalActionMessage?.length >
                  0 && (
                  <a
                    href="#actions"
                    className="underline text-decathlon hover:text-decathlon-dark text-sm"
                  >
                    Please check the actions required ↓
                  </a>
                )}
              </div>

              <dl className="mt-12 text-sm font-medium">
                <dt className="text-gray-900">Tracking id</dt>
                <dd className="mt-2 text-decathlon-dark">
                  {intentDetails.transaction.id}
                </dd>
              </dl>
            </div>

            <div className="mt-10 border-t border-gray-200">
              <h2 className="sr-only">Your order</h2>

              <h3 className="sr-only">Items</h3>
              {orderedProducts.map(product => (
                <div
                  key={product.reference_id}
                  className="flex space-x-6 border-b border-gray-200 py-10"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
                  />
                  <div className="flex flex-auto flex-col">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                      <p className="mt-2 text-sm text-gray-600">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-1 items-end">
                      <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                        <div className="flex">
                          <dt className="font-medium text-gray-900">
                            Quantity
                          </dt>
                          <dd className="ml-2 text-gray-700">
                            {product.quantity}
                          </dd>
                        </div>
                        <div className="flex pl-4 sm:pl-6">
                          <dt className="font-medium text-gray-900">Price</dt>
                          <dd className="ml-2 text-gray-700">
                            {product.amount}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}

              <div className="sm:ml-40 sm:pl-6">
                {intentDetails.transaction.externalActionMessage?.length >
                  0 && (
                  <div className="border-b border-gray-200 mt-10 pb-10">
                    <h4
                      className="text-lg font-medium text-gray-900 mb-2 scroll-mt-20"
                      id="actions"
                    >
                      Actions required
                    </h4>
                    <ul className="list-decimal list-inside text-gray-800 space-y-1">
                      {intentDetails.transaction.externalActionMessage.map(
                        message => (
                          <li key={`${message}`}>
                            <LinkItUrl className="text-blue-600 underline hover:text-blue-500">
                              {message}
                            </LinkItUrl>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <h3 className="sr-only">Your information</h3>

                <h4 className="sr-only">Addresses</h4>
                <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                  <div>
                    <dt className="font-medium text-gray-900">
                      Shipping address
                    </dt>
                    <dd className="mt-2 text-gray-700">
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
                    <dt className="font-medium text-gray-900">
                      Contact Information
                    </dt>
                    {intentDetails.transaction.billingData && (
                      <dd className="mt-2 text-gray-700">
                        <address className="not-italic">
                          <span className="block">
                            {intentDetails.transaction.billingData.first_name}{' '}
                            {intentDetails.transaction.billingData.last_name}
                          </span>
                          <span className="block">
                            {intentDetails.transaction.billingData.email}
                          </span>
                          <span className="block">
                            {intentDetails.transaction.billingData.phone_number}
                          </span>
                        </address>
                      </dd>
                    )}
                  </div>
                </dl>

                <h4 className="sr-only">Payment</h4>
                <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
                  <div>
                    <dt className="font-medium text-gray-900">
                      Payment method
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p>{intentDetails.transaction.paymentMethodName}</p>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">
                      Shipping method
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p>DHL</p>
                      <p>Takes up to 3 working days</p>
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">Summary</h3>

                <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">Total</dt>
                    <dd className="text-gray-900">
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
