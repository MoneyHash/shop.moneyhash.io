import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

import DecathlonLogo from '../assets/Decathlon.svg';

export default function Banner() {
  const location = useLocation();
  return (
    <div
      className={clsx(
        'fixed bottom-4 px-2 flex justify-center w-full pointer-events-none z-10',
        location.pathname === '/checkout' && 'max-xl:bottom-16',
      )}
    >
      <div className="w-full flex items-center justify-center shadow-lg max-w-3xl bg-white border border-gray-100 rounded-full space-x-2 text-gray-800 font-medium text-xs py-3 px-4 pointer-events-auto md:text-sm">
        <img src={DecathlonLogo} alt="" className="w-28" />
        <p>
          <a
            href="https://moneyhash.io/"
            target="_blank"
            className="text-decathlon-dark hover:text-decathlon"
            rel="noreferrer"
          >
            MoneyHash
          </a>{' '}
          demo that uses{' '}
          <a
            href="https://docs.moneyhash.io/docs/javascript-sdk"
            target="_blank"
            className="text-decathlon-dark hover:text-decathlon"
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
