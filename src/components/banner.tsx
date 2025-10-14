import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { MoneyHashLogo } from '@/components/moneyHashLogo';

export default function Banner() {
  const location = useLocation();
  return (
    <div
      dir="ltr"
      className={clsx(
        'fixed bottom-4 px-2 flex justify-center w-full pointer-events-none z-10',
        location.pathname === '/checkout' && 'max-xl:bottom-16',
      )}
    >
      <div className="w-full flex items-center justify-center shadow-lg max-w-3xl bg-background border text-foreground rounded-full space-x-2 font-medium text-xs py-3 px-4 pointer-events-auto md:text-sm">
        <MoneyHashLogo />
        <p>
          Shop is a{' '}
          <a
            href="https://moneyhash.io/"
            target="_blank"
            className="text-indigo-500 hover:text-indigo-600"
            rel="noreferrer"
          >
            MoneyHash
          </a>{' '}
          demo that uses{' '}
          <a
            href="https://docs.moneyhash.io/docs/javascript-sdk"
            target="_blank"
            className="text-indigo-500 hover:text-indigo-600"
            rel="noreferrer"
          >
            JavaScript SDK
          </a>{' '}
          to power custom checkout experiences.
        </p>
      </div>
    </div>
  );
}
