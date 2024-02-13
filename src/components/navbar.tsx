import { Link } from 'react-router-dom';
import useCurrency from '../store/useCurrency';
import type { Currency } from '../utils/productSections';
import ShoppingCart from './shoppingCart';
import DecathlonLogo from '../assets/Decathlon.svg';

const navigation = [
  { name: 'Fleeces', href: '#Fleeces' },
  { name: 'Inline Skating', href: '#Inline Skating' },
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
      className="z-20 bg-white bg-opacity-90 backdrop-blur-xl sticky top-0 border-b shadow-sm border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-1">
            <img src={DecathlonLogo} alt="Decathlon" className="h-10" />
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
                <option value="ZAR">ZAR</option>
                <option value="EUR">EUR</option>
                <option value="EGP">EGP</option>
              </select>
            </>
          )}

          {!hideCart && <ShoppingCart />}
        </div>
      </div>
    </nav>
  );
}
