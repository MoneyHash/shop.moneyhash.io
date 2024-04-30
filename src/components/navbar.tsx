import { Link } from 'react-router-dom';
import useCurrency from '../store/useCurrency';
import type { Currency } from '../store/useCurrency';
import Logo from '../assets/logo.svg';

export default function NavBar({
  hideCurrency = false,
}: {
  hideCurrency?: boolean;
}) {
  const { currency, setCurrency } = useCurrency(state => state);
  return (
    <nav
      aria-label="Top"
      className="z-20 bg-white bg-opacity-90 backdrop-blur-xl sticky top-0 border-b shadow-sm border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center relative">
        <div className="flex">
          <Link
            to="/"
            className="bg-primary flex-shrink-0 flex-col items-end pt-16 absolute shadow-sm px-1 pb-1 focus:outline-none"
          >
            <img src={Logo} alt="Emirates" className="h-14" />
          </Link>

          <ul className="flex space-x-1 sm:space-x-3 px-px sm:px-4 h-14 items-center ml-24">
            <li className="text-base font-medium whitespace-nowrap">
              <Link
                to="/#book"
                className="px-1 py-4 align-middle focus:outline-none focus:underline focus:text-primary hover:text-primary hover:underline"
              >
                Book
              </Link>
            </li>
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
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EGP">EGP</option>
              </select>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
