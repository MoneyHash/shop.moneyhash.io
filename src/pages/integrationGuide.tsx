import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwlTheme from 'react-syntax-highlighter/dist/esm/styles/hljs/night-owl';
import NavBar from '../components/navbar';
import UserDataImage from '../assets/guide/UserData.png';
import CreateIntentImage from '../assets/guide/CreateIntent.png';
import PaymentMethodsImage from '../assets/guide/PaymentMethods.png';
import CompleteOrderImage from '../assets/guide/CompleteOrder.png';

export default function IntegrationGuide() {
  return (
    <>
      <NavBar hideCart hideCurrency />

      <div className="prose mx-auto pt-4 pb-24 max-w-4xl prose-a:text-decathlon prose-a:hover:decoration-decathlon-dark">
        <h1 className="text-center">
          MoneyHash JavaScript SDK integration guide
        </h1>
        <h2>Installing</h2>
        <CodeBlock language="powershell">
          npm install moneyhash-js-sdk
        </CodeBlock>
        <hr />
        <h2>Collecting User Info</h2>
        <img src={UserDataImage} alt="" />
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

        <img src={CreateIntentImage} alt="" />
        <CodeBlock language="javascript">
          {`const intent = await createIntent({
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
        </CodeBlock>

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
            <CodeBlock language="javascript">
              {`import MoneyHash from "@moneyhash/js-sdk/headless";
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
            </CodeBlock>
          </li>
          <li>
            Get intent payment methods
            <CodeBlock language="javascript">
              {`const { paymentMethods } = await moneyHash.getIntentMethods(intentId);`}
            </CodeBlock>
          </li>
          <li>
            Render your custom UI for the payment methods
            <img src={PaymentMethodsImage} alt="" />
          </li>
          <li>
            Selecting a payment method using moneyHash sdk
            <CodeBlock language="javascript">
              {`await moneyHash.proceedWith({
  type: 'method',
  id: methodId,
  intentId,
})`}
            </CodeBlock>
          </li>
          <li>
            Complete order navigates to MoneyHash Checkout
            <img src={CompleteOrderImage} alt="" />
            <CodeBlock language="javascript">
              {`<a href={\`https://embed.moneyhash.io/embed/payment/\${intentId}\`}>Complete Order</a>`}
            </CodeBlock>
          </li>
          <li>
            After Checkout is done, MoneyHash will redirect to one of the
            redirect links based on the intent status{' '}
            <span className="text-slate-500">
              (links are specified while creating the)
            </span>
            <ul>
              <li>successful_redirect_url</li>
              <li>failed_redirect_url</li>
              <li>pending_external_action_redirect_url</li>
              <li>back_url</li>
            </ul>
          </li>
        </ol>

        <hr />

        <h2>In App Checkout</h2>
        <p>
          First four steps are the same but instead to redirect the page to
          external checkout app, you can use the MoneyHash SDK to render the
          checkout as part of the application with
        </p>
        <CodeBlock language="javascript">
          {`moneyHash.renderForm({ selector: '<css-selector>', intentId });`}
        </CodeBlock>
        <blockquote>
          <p>
            <strong>Note:</strong> Make sure dom node with {`<css-selector>`} is
            rendered in the dom before calling this method
          </p>
        </blockquote>
        <h3>
          <a href="To stay up to date with the process, you can use the onComplete and/or onFail callback methods when creating the MoneyHash instance.">
            Event Listeners
          </a>
        </h3>
        <p>
          To stay up to date with the process, you can use the onComplete and/or
          onFail callback methods when creating the MoneyHash instance.
        </p>
        <CodeBlock language="javascript">
          {`const moneyHash = new MoneyHash({
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
        </CodeBlock>
      </div>
    </>
  );
}

function CodeBlock({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  return (
    <div className="not-prose rounded overflow-hidden">
      <SyntaxHighlighter language={language} style={nightOwlTheme}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
