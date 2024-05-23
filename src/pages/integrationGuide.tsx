import NavBar from '../components/navbar';
import CodeBlock from '../components/codeBlock';
import UserDataImage from '../assets/guide/userData.png';
import PaymentMethodsImage from '../assets/guide/paymentMethods.png';

export default function IntegrationGuide() {
  return (
    <>
      <NavBar hideCart hideCurrency />

      <div className="prose mx-auto pt-4 pb-24 max-w-4xl prose-a:text-decathlon prose-a:hover:decoration-decathlon-dark">
        <h1 className="text-center">
          MoneyHash JavaScript SDK integration guide
        </h1>
        <h2>Installing</h2>
        <CodeBlock lang="shell" code="npm install @moneyhash/js-sdk" />
        <hr />
        <h2>Collecting User Info</h2>
        <img src={UserDataImage} alt="" className="rounded-md" />
        <p>This step has no thing to do with moneyHash checkout integration</p>
        <p>
          Personal information & Shipping address is collected by the merchant
          and sent to MoneyHash{' '}
          <span className="text-sm text-slate-500">
            (this is optional and not blocker to create a payment intent)
          </span>
        </p>
        <h2>Creating a Payment Intent</h2>
        <p>
          After collection all info required for the payment, You can call your
          backend server to create a payment intent with your account API Key{' '}
          <a
            href="https://docs.moneyhash.io/reference/payment-intent-v11"
            target="_blank"
            rel="noreferrer"
          >
            Payment Intent V1.1
          </a>{' '}
          <span className="text-sm text-slate-500">
            (all required and customization options mentioned in the docs)
          </span>
        </p>

        <CodeBlock
          code={`const intent = await createIntent({
      amount: totalPrice,
      currency,
      billing_data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
      },
      shipping_data: {
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
      },
      product_items: cart.map(product => ({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        amount: product.price[currency],
      })),
      hide_amount_sidebar: true, // UI customization
      hide_navigation_to_payment_methods: true, // UI customization
      successful_redirect_url: \`${window.location.origin}/checkout/order\`,
      failed_redirect_url: \`${window.location.origin}/checkout/order\`,
      pending_external_action_redirect_url: \`${window.location.origin}/checkout/order\`,
      back_url: \`${window.location.origin}/checkout/order\`,
    });`}
        />

        <h2>Checkout</h2>
        <p>
          After successfully creating a payment intent, you can use the payment
          intent ID &{' '}
          <a
            href="https://docs.moneyhash.io/docs/javascript-sdk"
            target="_blank"
            rel="noreferrer"
          >
            MoneyHash JavaScript SDK constructor
          </a>{' '}
          to get details about the intent & available payment methods
        </p>
        <ol>
          <li>
            Create moneyHash sdk instance in your application
            <CodeBlock
              code={`import MoneyHash from "@moneyhash/js-sdk/headless";
const moneyHash = new MoneyHash({
    type: 'payment',
    styles: { // customize the checkout UI
      input: {
        focus: {
          borderColor: '#1A82C3',
          boxShadow: '0 0 0 1px #1A82C378',
        },
      },
      submitButton: {
        base: {
          background: '#1A82C3',
          color: '#fff',
        },
        hover: {
          background: '#15699e',
        },
        focus: {
          background: '#15699e',
        },
      },
      loader: {
        backgroundColor: 'white',
        color: '#1A82C3',
      },
    },
  })`}
            />
          </li>
          <li>
            Get intent payment methods
            <CodeBlock code="const { paymentMethods } = await moneyHash.getIntentMethods(intentId);" />
          </li>
          <li>
            Render your custom UI for the payment methods
            <img src={PaymentMethodsImage} alt="" className="rounded-md" />
          </li>
          <li>
            Selecting a payment method using moneyHash sdk
            <CodeBlock
              code={`await moneyHash.proceedWith({
  type: 'method',
  id: methodId,
  intentId,
})`}
            />
          </li>

          <li>
            Use MoneyHash SDK to render the checkout as part of the application
            with
            <CodeBlock
              code={`moneyHash.renderForm({ selector: '<css-selector>', intentId });`}
            />
            <blockquote>
              <p>
                <strong>Note:</strong> Make sure dom node with{' '}
                {`<css-selector>`} is rendered in the dom before calling this
                method
              </p>
            </blockquote>
          </li>
          <li>
            <a
              className="text-xl"
              href="To stay up to date with the process, you can use the onComplete and/or onFail callback methods when creating the MoneyHash instance."
            >
              Event Listeners
            </a>
            <p>
              To stay up to date with the process, you can use the onComplete
              and/or onFail callback methods when creating the MoneyHash
              instance.
            </p>
            <CodeBlock
              code={`const moneyHash = new MoneyHash({
  onComplete: ({ intent, transaction, selectedMethod, redirect, state }) => {
    // redirect to /checkout/order
    console.log("onComplete", {
      intent,
      transaction,
      selectedMethod,
      redirect,
      state,
    });
  },
  onFail: ({ intent, transaction, selectedMethod, redirect, state }) => {
    // redirect to /checkout/order
    console.log("onFail", {
      intent,
      transaction,
      selectedMethod,
      redirect,
      state,
    });
  },
})`}
            />
          </li>
        </ol>
      </div>
    </>
  );
}
