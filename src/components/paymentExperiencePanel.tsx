import { useState } from 'react';
import { ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import usePaymentExperience from '../store/usePaymentExperience';

export default function PaymentExperiencePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { experience, setExperience } = usePaymentExperience(state => state);
  return (
    <div
      className={clsx(
        'fixed bottom-0 right-5 max-w-xs w-full flex flex-col rounded-md bg-slate-800 text-white text-sm z-20 transition-transform',
        isOpen ? 'translate-y-0' : 'translate-y-[140px]',
      )}
    >
      <button
        type="button"
        className="flex items-center p-4"
        onClick={() => setIsOpen(o => !o)}
      >
        <CreditCardIcon className="w-5 h-5" />
        <p className="uppercase ml-2">Payment Experience</p>
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 ml-auto transition-transform',
            isOpen ? 'rotate-0' : 'rotate-180',
          )}
        />
      </button>
      <div className="p-4 flex flex-col">
        <div className="flex space-x-2 items-center ">
          <input
            type="radio"
            id="in-app"
            name="payment-experience"
            value="in-app"
            className="text-primary focus:ring-0 focus:outline-none focus:ring-offset-0"
            checked={experience === 'in-app'}
            onChange={e => {
              setExperience(e.target.value as any);
              setTimeout(() => {
                setIsOpen(false);
              }, 300);
            }}
          />
          <label htmlFor="in-app">In App Checkout</label>
        </div>

        <div className="flex space-x-2 items-center mt-2">
          <input
            type="radio"
            id="redirect"
            name="payment-experience"
            value="redirect"
            className="text-primary focus:ring-0 focus:outline-none focus:ring-offset-0"
            checked={experience === 'redirect'}
            onChange={e => {
              setExperience(e.target.value as any);
              setTimeout(() => {
                setIsOpen(false);
              }, 300);
            }}
          />
          <label htmlFor="redirect">Redirect to External checkout</label>
        </div>

        <a
          className="mt-5 text-center bg-primary rounded-md hover:bg-primary-dark py-2"
          href="https://docs.stripe.com/testing?testing-method=card-numbers#cards"
          target="_blank"
          rel="noopener noreferrer"
        >
          Test Cards
        </a>
        {/* <Link
          className="mt-5 text-center bg-green-500 rounded-md hover:bg-green-600 py-2"
          to="/integration-guide"
          target="_blank"
        >
          Integration Guide
        </Link> */}
      </div>
    </div>
  );
}
