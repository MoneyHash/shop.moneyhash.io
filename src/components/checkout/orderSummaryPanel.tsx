import { useTranslation } from 'react-i18next';
import formatCurrency from '@/utils/formatCurrency';
import type { Currency, Product } from '@/utils/productSections';
import twoFixedDigit from '@/utils/twoFixedDigits';

export function OrderSummaryPanel({
  totalPrice,
  cart,
  currency,
}: {
  totalPrice: number;
  cart: (Product & { quantity: number })[];
  currency: Currency;
}) {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="summary-heading"
      className="py-12 bg-accent text-accent-foreground md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
    >
      <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
        <h2 id="summary-heading" className="sr-only">
          {t('checkout.orderSummary')}
        </h2>

        <dl className="flex items-center justify-between border-b dark:border-gray-700/50 pb-6 ">
          <dt className="text-base">{t('checkout.total')}</dt>
          <dd className="text-base">
            {formatCurrency({
              currency,
              amount: totalPrice,
            })}
          </dd>
        </dl>

        <ul className="divide-y divide-border dark:border-gray-700/50 text-sm font-medium">
          {cart.map(product => (
            <li key={product.id} className="flex items-start gap-4 py-6">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="h-20 w-20 flex-none rounded-md object-cover object-center"
              />
              <div className="flex-auto space-y-1">
                <h3>{t(product.nameKey)}</h3>
                <p className="text-subtle">{t(product.descriptionKey)}</p>
                <p className="text-subtle">
                  {t('cart.quantity')} {product.quantity}
                </p>
              </div>
              <p className="flex-none text-base font-medium ">
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
      </div>
    </section>
  );
}
