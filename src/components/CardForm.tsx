import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IntentStateDetails } from '@moneyhash/js-sdk/headless';
import clsx from 'clsx';

import useShoppingCart from '../store/useShoppingCart';
import useMoneyHash from '../hooks/useMoneyHash';

type FormErrors = {
  card_holder_name?: string;
  card_number?: string;
  cvv?: string;
  expiry_month?: string;
  expiry_year?: string;
  general_error?: string;
};

export default function CardForm({ intentId }: { intentId: string }) {
  const navigate = useNavigate();
  const emptyCart = useShoppingCart(state => state.emptyCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const moneyHash = useMoneyHash();

  useEffect(() => {
    const elements = moneyHash.elements({});

    const cardHolderName = elements.create({
      elementType: 'cardHolderName',
      elementOptions: {
        selector: '#card-holder-name',
        placeholder: 'Card holder name',
      },
    });

    const cardNumber = elements.create({
      elementType: 'cardNumber',
      elementOptions: {
        selector: '#card-number',
        placeholder: 'Card number',
      },
    });

    const cardCvv = elements.create({
      elementType: 'cardCvv',
      elementOptions: {
        selector: '#card-cvv',
        placeholder: 'CVV',
      },
    });

    const cardExpiryMonth = elements.create({
      elementType: 'cardExpiryMonth',
      elementOptions: {
        selector: '#card-expiry-month',
        placeholder: 'MM',
      },
    });

    const cardExpiryYear = elements.create({
      elementType: 'cardExpiryYear',
      elementOptions: {
        selector: '#card-expiry-year',
        placeholder: 'YY',
      },
    });

    cardHolderName.mount();
    cardNumber.mount();
    cardCvv.mount();
    cardExpiryMonth.mount();
    cardExpiryYear.mount();
  }, [moneyHash, intentId]);

  const submitCardData = async () => {
    try {
      setIsSubmitting(true);
      const intentDetails = await moneyHash.getIntentDetails(intentId);
      // console.log(intentDetails);
      await moneyHash.submitForm({
        intentId,
        accessToken: (
          intentDetails?.stateDetails as IntentStateDetails<'FORM_FIELDS'>
        )?.formFields?.card?.accessToken,
        // billingData,
        // shippingData,
      });
      emptyCart();
      navigate(`/checkout/order?intent_id=${intentId}`, { replace: true });
    } catch (error) {
      setFormErrors(error as FormErrors);
      // console.error('MoneyHash submitForm error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {formErrors.general_error && (
          <span className="text-sm text-red-500">
            {formErrors.general_error}
          </span>
        )}
        <div className="md:col-span-2">
          <div
            id="card-holder-name"
            className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.moneyhash-element\_focus]:border-decathlon [&.moneyhash-element\_focus]:ring-decathlon sm:text-sm"
          />
          {formErrors.card_holder_name && (
            <span className="text-xs text-red-500">
              {formErrors.card_holder_name}
            </span>
          )}
        </div>

        <div className="md:col-span-2">
          <div
            id="card-number"
            className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.moneyhash-element\_focus]:border-decathlon [&.moneyhash-element\_focus]:ring-decathlon sm:text-sm"
          />
          {formErrors.card_number && (
            <span className="text-xs text-red-500">
              {formErrors.card_number}
            </span>
          )}
        </div>

        <div className="">
          <div
            id="card-expiry-month"
            className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.moneyhash-element\_focus]:border-decathlon [&.moneyhash-element\_focus]:ring-decathlon sm:text-sm"
          />
          {formErrors.expiry_month && (
            <span className="text-xs text-red-500">
              {formErrors.expiry_month}
            </span>
          )}
        </div>

        <div className="">
          <div
            id="card-expiry-year"
            className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.moneyhash-element\_focus]:border-decathlon [&.moneyhash-element\_focus]:ring-decathlon sm:text-sm"
          />
          {formErrors.expiry_year && (
            <span className="text-xs text-red-500">
              {formErrors.expiry_year}
            </span>
          )}
        </div>

        <div className="md:col-span-2">
          <div
            id="card-cvv"
            className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.moneyhash-element\_focus]:border-decathlon [&.moneyhash-element\_focus]:ring-decathlon sm:text-sm"
          />
          {formErrors.cvv && (
            <span className="text-xs text-red-500">{formErrors.cvv}</span>
          )}
        </div>
      </div>

      <div className="submit-container">
        <button
          type="button"
          className={clsx(
            'rounded-md border border-transparent bg-decathlon px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-decathlon-dark focus:outline-none focus:ring-2 focus:ring-decathlon focus:ring-offset-2 focus:ring-offset-gray-50',
            isSubmitting && 'opacity-50 cursor-progress',
          )}
          disabled={isSubmitting}
          onClick={submitCardData}
        >
          Submit
        </button>
      </div>
    </>
  );
}
