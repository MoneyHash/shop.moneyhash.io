import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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

        <p>
          Shop is a{' '}
          <a
            href="https://moneyhash.io/"
            target="_blank"
            className="text-indigo-600 hover:text-indigo-500"
            rel="noreferrer"
          >
            MoneyHash
          </a>{' '}
          demo that uses{' '}
          <a
            href="https://docs.moneyhash.io/docs/javascript-sdk"
            target="_blank"
            className="text-indigo-600 hover:text-indigo-500"
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
