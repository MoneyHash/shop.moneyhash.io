import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { type IntentDetails } from '@moneyhash/js-sdk/headless';
import { LinkItUrl } from 'react-linkify-it';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/loader';
import NavBar from '@/components/navbar';
import { moneyHash } from '@/utils/moneyHash';
import formatCurrency from '@/utils/formatCurrency';
import { products, type Currency } from '@/utils/productSections';
import NotFound from '@/components/notFound';
import TransactionFailed from '@/components/transactionFailed';
import { logJSON } from '@/utils/logJSON';
import { SubscriptionPlanCard } from '@/components/subscriptionPlanCard';
import { useTheme } from '@/context/themeProvider';

export default function Order() {
  const { t } = useTranslation();
  const [intentDetails, setIntentDetails] =
    useState<IntentDetails<'payment'> | null>(null);
  const [error, setError] = useState();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('intent_id');
  const { theme } = useTheme();

  useEffect(() => {
    if (!orderId) return;
    moneyHash
      .getIntentDetails(orderId)
      .then(intentDetails => {
        logJSON.response('getIntentDetails', intentDetails);
        setIntentDetails(intentDetails);
      })
      .catch(setError);
  }, [orderId]);

  const currency = intentDetails?.intent.amount.currency! as Currency;
  const totalPrice = intentDetails?.intent.amount.formatted;

  const orderedProducts = useMemo(() => {
    if (!intentDetails?.productItems) return [];

    return intentDetails.productItems.map(productItem => {
      const product = products.find(
        product => product.nameKey === productItem.name,
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
        <TransactionFailed message={t('order.paymentClosed')} />
      </div>
    );
  }

  const externalActionMessage =
    intentDetails?.transaction?.externalActionMessage || [];

  const customFields = intentDetails?.transaction?.customFields;

  return (
    <div>
      <NavBar hideCurrency hideCart />
      {intentDetails ? (
        <div className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-xl">
              <h1 className="text-base font-medium text-primary">
                {t('order.thankYou')}
              </h1>
              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                {intentDetails.subscription
                  ? t('order.congratulations')
                  : t('order.onTheWay')}
              </p>
              <div className="mt-2 text-base text-subtle">
                {intentDetails.subscription ? (
                  <p>
                    {t('order.subscriptionActive', {
                      subscriptionId: intentDetails.subscription.id,
                    })}
                  </p>
                ) : (
                  <p>
                    {t('order.orderShipped', {
                      orderId,
                    })}
                  </p>
                )}
                {externalActionMessage?.length > 0 && (
                  <a href="#actions" className="underline text-sm text-primary">
                    {t('order.checkActionsRequired')}
                  </a>
                )}
              </div>

              <dl className="mt-12 text-sm font-medium">
                <dt className="text-bolder">{t('order.trackingId')}</dt>
                <dd className="mt-2 text-primary dark:text-subtler">
                  {intentDetails.transaction?.id}
                </dd>
              </dl>
            </div>

            {intentDetails.subscription && (
              <div className="mt-10">
                <SubscriptionPlanCard plan={intentDetails.subscription.plan} />
              </div>
            )}

            <div className="mt-10 border-t">
              <h2 className="sr-only">{t('order.yourOrder')}</h2>
              <h3 className="sr-only">{t('order.items')}</h3>
              {orderedProducts.map(product => (
                <div
                  key={product.reference_id}
                  className="flex gap-6 border-b py-10"
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-20 w-20 flex-none rounded-lg object-cover object-center sm:h-40 sm:w-40"
                  />
                  <div className="flex flex-auto flex-col">
                    <div>
                      <h4 className="font-medium">{t(product.name)}</h4>
                      <p className="mt-2 text-sm text-subtle">
                        {t(product.description)}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-1 items-end">
                      <dl className="flex gap-4 text-sm sm:gap-6 divide-x rtl:divide-x-reverse">
                        <div className="flex">
                          <dt className="font-medium text-subtler">
                            {t('order.quantity')}
                          </dt>
                          <dd className="ms-2 text-bolder">
                            {product.quantity}
                          </dd>
                        </div>
                        <div className="flex ps-4 sm:ps-6">
                          <dt className="font-medium text-subtler">
                            {t('order.price')}
                          </dt>
                          <dd className="ms-2 text-bolder">{product.amount}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
              <div className="sm:ms-40 sm:ps-6">
                {externalActionMessage?.length > 0 && (
                  <div className="border-b mt-10 pb-10">
                    <h4
                      className="text-lg font-medium text-subtle mb-2 scroll-mt-20"
                      id="actions"
                    >
                      {t('order.actionsRequired')}
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

                <h3 className="sr-only">{t('order.yourInformation')}</h3>

                <h4 className="sr-only">{t('order.addresses')}</h4>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-6 py-10 text-sm sm:grid-cols-2">
                  {intentDetails.shippingData && (
                    <div>
                      <dt className="font-medium text-subtle">
                        {t('order.shippingAddress')}
                      </dt>
                      <dd className="mt-2">
                        <address className="not-italic">
                          <span className="block">
                            {intentDetails.shippingData.address}
                          </span>
                          <span className="block">
                            {intentDetails.shippingData.city},{' '}
                            {intentDetails.shippingData.state}
                          </span>
                        </address>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium text-subtle">
                      {t('order.contactInformation')}
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

                <h4 className="sr-only">{t('order.payment')}</h4>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-6 border-t py-10 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-subtle">
                      {t('order.paymentMethod')}
                    </dt>
                    <dd className="mt-2">
                      <p>{intentDetails.transaction?.paymentMethodName}</p>

                      {customFields && (customFields?.artUri as any) && (
                        <src-card
                          descriptor-name={customFields.descriptorName}
                          account-number-suffix={customFields.panLastFour}
                          card-art={customFields.artUri}
                          dark={theme === 'dark' ? true : undefined}
                        />
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-subtle">
                      {t('order.shippingMethod')}
                    </dt>
                    <dd className="mt-2">
                      <p>{t('order.dhlShipping')}</p>
                      <p>{t('order.dhlDescription')}</p>
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">{t('order.summary')}</h3>

                {!!totalPrice && (
                  <dl className="space-y-6 border-t pt-10 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-medium text-bolder">
                        {t('order.total')}
                      </dt>
                      <dd>
                        {formatCurrency({
                          currency,
                          amount: totalPrice!,
                        })}
                      </dd>
                    </div>
                  </dl>
                )}
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
