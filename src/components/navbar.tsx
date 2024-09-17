import { Link } from 'react-router-dom';
import useCurrency from '@/store/useCurrency';
import ShoppingCart from '@/components/shoppingCart';
import { MoneyHashLogo } from '@/components/moneyHashLogo';
import { Select } from '@/components/ui/select';
import { ThemeToggleMenu } from '@/components/themeToggleMenu';
import { Configuration } from '@/components/configuration';

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
    <div className="fixed top-0 w-full z-30">
      <Configuration />
      <nav aria-label="Top" className="z-20  bg-background  border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center space-x-1 mr-3"
            >
              <MoneyHashLogo />
              <span className="font-semibold text-lg"> Shop</span>
            </Link>

            <ul className="flex space-x-1 sm:space-x-3 px-px sm:px-4">
              {navigation.map(navItem => (
                <li
                  key={navItem.name}
                  className="text-base font-medium whitespace-nowrap"
                >
                  <Link
                    to={`/${navItem.href}`}
                    className="px-1 py-4 align-middle outline-none hover:underline hover:text-primary focus-visible:underline focus-visible:text-primary"
                  >
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            {!hideCurrency && (
              <>
                <label htmlFor="currency" className="sr-only">
                  Currency
                </label>
                <Select
                  id="currency"
                  value={currency}
                  onChange={value => setCurrency(value)}
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="AED">AED</option>
                  <option value="KWD">KWD</option>
                  <option value="SAR">SAR</option>
                </Select>
              </>
            )}

            {!hideCart && <ShoppingCart />}
            <div className="shrink-0">
              <ThemeToggleMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
