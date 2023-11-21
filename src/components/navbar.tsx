import useCurrency from '../store/useCurrency';
import type { Currency } from '../utils/productSections';
import ShoppingCart from './shoppingCart';

const navigation = [
  { name: 'Shirts', href: '#Shirts' },
  { name: 'Bags', href: '#Bags' },
];

export default function NavBar() {
  const { currency, setCurrency } = useCurrency(state => state);
  return (
    <nav
      aria-label="Top"
      className="z-50 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter sticky top-0 border-b border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center">
          <a href="/" className="flex-shrink-0">
            <span className="sr-only">MoneyHash Shop</span>
            <img
              className="h-8 w-8"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>

          <ul className="flex space-x-1 sm:space-x-3 px-px sm:px-4">
            {navigation.map(navItem => (
              <li
                key={navItem.name}
                className="text-base font-medium whitespace-nowrap"
              >
                <a
                  href={navItem.href}
                  className="px-1 py-4 focus:outline-none focus:underline focus:text-blue-600"
                >
                  {navItem.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-auto flex items-center">
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

          {/* Cart */}
          <div className="flow-root lg:ml-6">
            <ShoppingCart />
          </div>
        </div>
      </div>
    </nav>
  );
}
