import { Link } from 'react-router-dom';
import useCurrency from '../store/useCurrency';
import type { Currency } from '../utils/productSections';
import ShoppingCart from './shoppingCart';

const navigation = [
  { name: 'Shirts', href: '#Shirts' },
  { name: 'Bags', href: '#Bags' },
];

export default function NavBar({
  hideCurrency = false,
  hideCart = false,
}: {
  hideCurrency?: boolean;
  hideCart?: boolean;
}) {
  const { currency, setCurrency } = useCurrency(state => state);
  return (
    <nav
      aria-label="Top"
      className="z-10 bg-white bg-opacity-90 backdrop-blur-xl sticky top-0 border-b shadow-sm border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-1">
            <span className="sr-only">MoneyHash Shop</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              className="rounded-sm flex-shrink-0"
            >
              <path
                fill="#101E3B"
                fillRule="evenodd"
                d="M32 0H0v17.5h11.125l.826-2.76H9l.452-2.04h2.99l1.26-4.3h2.577l-1.26 4.3h3.856l1.26-4.3h2.596l-1.259 4.3H32V0Zm0 14.74H20.98l-.826 2.76H23.2l-.469 2.04h-3.069l-1.18 4.06h-2.597l1.2-4.06H13.25l-1.22 4.06H9.453l1.2-4.06H0V32h32V14.74Zm-17.453 0-.806 2.76h3.836l.807-2.76h-3.837Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-lg text-[#101E3B]">| Shop</span>
          </Link>

          <ul className="flex space-x-1 sm:space-x-3 px-px sm:px-4">
            {navigation.map(navItem => (
              <li
                key={navItem.name}
                className="text-base font-medium whitespace-nowrap"
              >
                <Link
                  to={`/${navItem.href}`}
                  className="px-1 py-4 align-middle focus:outline-none focus:underline focus:text-blue-600"
                >
                  {navItem.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-auto flex items-center">
          {!hideCurrency && (
            <>
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                className="border-none rounded-md bg-transparent"
                onChange={e => setCurrency(e.target.value as Currency)}
              >
                <option value="USD">USD</option>
                <option value="EGP">EGP</option>
                <option value="SAR">SAR</option>
              </select>
            </>
          )}

          {!hideCart && <ShoppingCart />}
        </div>
      </div>
    </nav>
  );
}
