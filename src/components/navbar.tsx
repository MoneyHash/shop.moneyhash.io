import { Link } from 'react-router-dom';
import { SelectValue } from '@radix-ui/react-select';
import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrency from '@/store/useCurrency';
import ShoppingCart from '@/components/shoppingCart';
import { MoneyHashLogo } from '@/components/moneyHashLogo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ThemeToggleMenu } from '@/components/themeToggleMenu';
import { LanguageSwitcher } from '@/components/languageSwitcher';

const Configuration = lazy(() =>
  import('@/components/configuration').then(mod => ({
    default: mod.Configuration,
  })),
);

export default function NavBar({
  hideCurrency = false,
  hideCart = false,
  hideConfig = false,
}: {
  hideCurrency?: boolean;
  hideCart?: boolean;
  hideConfig?: boolean;
}) {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency(state => state);

  const navigation = [
    { name: t('nav.shirts'), href: '#Shirts' },
    { name: t('nav.bags'), href: '#Bags' },
  ];

  return (
    <div className="fixed top-0 w-full z-30">
      {!hideConfig && <Configuration />}
      <nav
        aria-label="Top"
        className="z-20  bg-background  border-b shadow-sm -mt-1"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-1 me-3">
              <MoneyHashLogo />
              <span className="font-semibold text-lg hidden sm:block">
                {t('nav.shop')}
              </span>
            </Link>

            <ul className="flex gap-1 sm:gap-3 px-px sm:px-4">
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

          <div className="ms-auto flex items-center gap-2">
            {!hideCurrency && (
              <>
                <label htmlFor="currency" className="sr-only">
                  {t('nav.currency')}
                </label>
                <Select
                  value={currency}
                  onValueChange={value => setCurrency(value as any)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="EGP">EGP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="KWD">KWD</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {!hideCart && <ShoppingCart />}
            <div className="shrink-0">
              <LanguageSwitcher />
            </div>
            <div className="shrink-0">
              <ThemeToggleMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
