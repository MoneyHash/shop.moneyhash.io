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
  const [renderIframe, setRenderIframe] = useState(false);

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
      const { stateDetails } = await moneyHash.getIntentDetails(intentId);

      const intentDetails = await moneyHash.submitForm({
        intentId,
        accessToken: (stateDetails as IntentStateDetails<'FORM_FIELDS'>)
          ?.formFields?.card?.accessToken,
      });
      if (intentDetails.intent.status === 'PROCESSED') {
        emptyCart();
        navigate(`/checkout/order?intent_id=${intentId}`, { replace: true });
      } else if (intentDetails.state === 'URL_TO_RENDER') {
        setRenderIframe(true);
        await moneyHash.renderForm({
          intentId,
          selector: '#rendered-url-iframe-container',
        });
        // const { url, renderStrategy } =
        //   intentDetails.stateDetails as IntentStateDetails<'URL_TO_RENDER'>;
        // await moneyHash.renderUrl(url, renderStrategy);
      } else {
        setFormErrors({
          general_error: 'Payment failed. Please try again.',
        });
      }
    } catch (error) {
      setFormErrors(error as FormErrors);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div
        id="rendered-url-iframe-container"
        className={renderIframe ? 'h-[500px]' : ''}
      />
      {!renderIframe && (
        <>
          <div className="grid grid-cols-3 gap-4 my-4">
            {formErrors.general_error && (
              <span className="text-sm text-red-500">
                {formErrors.general_error}
              </span>
            )}

            <div className="col-span-full">
              <div
                id="card-holder-name"
                className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.MoneyHashElement--focus]:border-indigo-500 [&.MoneyHashElement--focus]:ring-1 [&.MoneyHashElement--focus]:ring-indigo-500"
              />
              {formErrors.card_holder_name && (
                <span className="text-xs text-red-500">
                  {formErrors.card_holder_name}
                </span>
              )}
            </div>

            <div className="col-span-full">
              <div
                id="card-number"
                className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.MoneyHashElement--focus]:border-indigo-500 [&.MoneyHashElement--focus]:ring-1 [&.MoneyHashElement--focus]:ring-indigo-500"
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
                className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.MoneyHashElement--focus]:border-indigo-500 [&.MoneyHashElement--focus]:ring-1 [&.MoneyHashElement--focus]:ring-indigo-500"
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
                className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.MoneyHashElement--focus]:border-indigo-500 [&.MoneyHashElement--focus]:ring-1 [&.MoneyHashElement--focus]:ring-indigo-500"
              />
              {formErrors.expiry_year && (
                <span className="text-xs text-red-500">
                  {formErrors.expiry_year}
                </span>
              )}
            </div>

            <div className="">
              <div
                id="card-cvv"
                className="rounded-md border border-gray-300 shadow-sm overflow-hidden [&.MoneyHashElement--focus]:border-indigo-500 [&.MoneyHashElement--focus]:ring-1 [&.MoneyHashElement--focus]:ring-indigo-500"
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
                'rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500-dark focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50',
                isSubmitting && 'opacity-50 cursor-progress',
              )}
              disabled={isSubmitting}
              onClick={submitCardData}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
}
