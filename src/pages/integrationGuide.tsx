import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { BookOpenText } from 'lucide-react';
import NavBar from '../components/navbar';
import CodeBlock from '../components/codeBlock';
import UserDataImage from '../assets/guide/userData.png';
import PaymentMethodsImage from '../assets/guide/paymentMethods.png';
import CardImage from '../assets/guide/card.png';
import MobileWalletImage from '../assets/guide/mobileWallet.png';
import PopupImage from '../assets/guide/popup.png';
import RedirectImage from '../assets/guide/redirect.png';
import RenderFormImage from '../assets/guide/renderForm.png';
import FailedTransactionImage from '../assets/guide/failedTransaction.png';
import SuccessTransactionImage from '../assets/guide/successTransaction.png';

export default function IntegrationGuide() {
  return (
    <>
      <NavBar hideCart hideCurrency />

      <div className="prose dark:prose-invert mx-auto pt-10 pb-24 max-w-4xl prose-a:text-decathlon prose-a:hover:decoration-decathlon-dark">
        <h1 className="text-center">
          MoneyHash JavaScript SDK integration guide
        </h1>
        <h2>Installing</h2>
        <CodeBlock lang="shell" code="npm install @moneyhash/js-sdk" />
        <hr />
        <section>
          <h2>Collecting User Info</h2>
          <img src={UserDataImage} alt="" className="rounded-md" />
          <p>
            This step has no thing to do with moneyHash checkout integration
          </p>
          <p>
            Personal information & Shipping address is collected by the merchant
            and sent to MoneyHash{' '}
            <span className="text-sm text-slate-500">
              (this is optional and not blocker to create a payment intent)
            </span>
          </p>
        </section>

        <section>
          <h2>Integration</h2>
          <ol>
            <li>
              Create moneyHash sdk instance in your application
              <ul>
                <li>
                  <a
                    href="https://docs.moneyhash.io/docs/authentication#account-key"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Account Public API Key
                  </a>
                </li>
                <li>
                  Event listeners with event listeners for MoneyHash rendered
                  iframe
                </li>
              </ul>
              <CodeBlock
                code={`import MoneyHash from "@moneyhash/js-sdk/headless";

export const moneyHash = new MoneyHash({
  type: 'payment',
  onComplete: ({ intent }) => {
    window.location.href = \`/checkout/order?intent_id=\${intent.id}\`;
  },
  onFail: ({ intent }) => {
    window.location.href = \`/checkout/order?intent_id=\${intent.id}'\`;
  },
  publicApiKey: '<Account Public API Key>',
});
`}
              />
            </li>

            <li>
              Get account payment methods based on currency, amount and
              operation ( &quot;purchas&quot; | &quot;authorize&quot; )
              <CodeBlock
                code={`  const { paymentMethods, expressMethods } = await moneyHash.getMethods({
  currency,
  amount,
  operation: 'purchase',
});`}
              />
              <blockquote>
                You can use operation &quot;authorize&quot; to get payment
                methods that allow authorization like `tabby`
              </blockquote>
            </li>

            <li>
              Render your custom UI for the payment methods
              <img src={PaymentMethodsImage} alt="" className="rounded-md" />
            </li>

            <li>
              <strong>Creating a Payment Intent</strong>
              <p>
                After collection all info required for the payment, You can call
                your backend server with user selected method to create a
                payment intent with your account API Key{' '}
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
  methodId: selectedMethod.id,
  currency,
  billing_data: userInfo,
  shipping_data: shippingInfo,
  product_items: productCartItems,
  successful_redirect_url: \`\${window.location.origin}/checkout/order\`,
  failed_redirect_url: \`\${window.location.origin}/checkout/order\`,
  pending_external_action_redirect_url: \`\${window.location.origin}/checkout/order\`,
  back_url: \`\${window.location.origin}/checkout/order\`,
});`}
              />
            </li>

            <li>
              Get access all intent details related to a specific intent & Let
              MoneyHash{' '}
              <a
                href="https://docs.moneyhash.io/docs/basics-concepts#sdk-states"
                target="_blank"
                rel="noreferrer"
              >
                SDK States
              </a>{' '}
              guide you through the actions and methods required to proceed and
              complete the flow
              <CodeBlock
                code="const intentDetails = await moneyHash.getIntentDetails(intentId);
"
              />
            </li>

            <blockquote>
              Updating the created intent to use another payment method instead
              of creating new intent
            </blockquote>
            <CodeBlock
              code={`await moneyHash.proceedWith({
  type: 'method',
  id: methodId,
  intentId,
})`}
            />

            <li>
              One of our SDK features is offering a single state for each step
              until the completion. The state along with stateDetails can guide
              you through the actions and methods required to proceed and
              complete the flow.{' '}
              <a
                href="https://docs.moneyhash.io/docs/basics-concepts#sdk-states"
                target="_blank"
                rel="noreferrer"
              >
                The table describes a brief of each action
              </a>{' '}
              related to each possible state value.
              <p>
                There are some intent states that you can use to customize your
                payment/payout experience.
                <a
                  href="https://github.com/MoneyHash/shop.moneyhash.io/blob/main/src/components/checkout/intentStateRenderer/index.tsx"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex ml-1 items-center space-x-1"
                >
                  <GitHubLogoIcon /> <span>Github</span>
                </a>
              </p>
              <ul>
                <li>
                  <SDKStateHeader
                    title="FORM_FIELDS"
                    docs="https://docs.moneyhash.io/docs/basics-concepts#form-fields"
                    github="https://github.com/MoneyHash/shop.moneyhash.io/blob/main/src/components/checkout/intentStateRenderer/cardForm.tsx"
                  />
                  <img src={CardImage} alt="" className="rounded-md" />
                  <img src={MobileWalletImage} alt="" className="rounded-md" />
                </li>

                <li>
                  <SDKStateHeader
                    title="URL_TO_RENDER"
                    docs="https://docs.moneyhash.io/docs/basics-concepts#url-to-render"
                    github="https://github.com/MoneyHash/shop.moneyhash.io/blob/main/src/components/checkout/intentStateRenderer/urlToRender.tsx"
                  />
                  <img src={PopupImage} alt="" className="rounded-md" />
                  <img src={RedirectImage} alt="" className="rounded-md" />
                </li>

                <li>
                  <SDKStateHeader
                    title="INTENT_FORM"
                    docs="https://docs.moneyhash.io/docs/basics-concepts#intent-form"
                    github="https://github.com/MoneyHash/shop.moneyhash.io/blob/main/src/components/checkout/intentStateRenderer/intentForm.tsx"
                  />
                  <img src={RenderFormImage} alt="" className="rounded-md" />
                </li>
              </ul>
            </li>

            <li>
              <p>
                Render your order details page after being redirected with query
                params for intent ID and other details
                <a
                  href="https://github.com/MoneyHash/shop.moneyhash.io/blob/main/src/pages/order.tsx"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1"
                >
                  <GitHubLogoIcon /> <span>Github</span>
                </a>
              </p>

              <a
                href="https://shop.moneyhash.io/checkout/order?type=transaction.successful&status=SUCCESSFUL&transaction_id=ca54759a-75f9-45de-916c-d3278b4382de&intent_id=ZD5qRl9&amount=6500.00&currency=EGP&token_saved=False&response_code=6000&response_message=Successful"
                target="_blank"
                rel="noreferrer"
              >
                Successful
              </a>
              <img
                src={SuccessTransactionImage}
                alt=""
                className="rounded-md"
              />

              <a
                href="https://shop.moneyhash.io/checkout/order?type=transaction.failed&status=FAILED&transaction_id=782cf70e-c3df-4221-99cc-fe87fc820986&intent_id=gazMxvZ&amount=225.00&currency=USD&token_saved=False&response_code=7000&response_message=Failed"
                target="_blank"
                rel="noreferrer"
              >
                Failed
              </a>

              <img src={FailedTransactionImage} alt="" className="rounded-md" />
            </li>
          </ol>
        </section>
      </div>
    </>
  );
}

function SDKStateHeader({
  title,
  docs,
  github,
}: {
  title: string;
  docs: string;
  github: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <code>{title}</code>
      <div className="inline-flex space-x-2">
        <a
          href={docs}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1"
        >
          <BookOpenText className="w-5 h-5" />
          <span>Docs</span>
        </a>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1"
        >
          <GitHubLogoIcon /> <span>Github</span>
        </a>
      </div>
    </div>
  );
}
