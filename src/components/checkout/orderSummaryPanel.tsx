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
  return (
    <section
      aria-labelledby="summary-heading"
      className="py-12 bg-indigo-900 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
    >
      <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>

        <ul className="divide-y divide-border/20 text-sm font-medium">
          {cart.map(product => (
            <li key={product.id} className="flex items-start space-x-4 py-6">
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
  );
}
