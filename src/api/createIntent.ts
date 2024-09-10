import axiosInstance from '.';

type ProductItem = {
  name: string;
  description: string;
  amount: number;
  quantity: number;
};

/**
 * Creating a payment intent here is just for demoing purposes only.
 * In a real-world scenario, you should create a payment intent via backend apis.
 */
export default function createIntent({
  amount,
  currency,
  billing_data,
  shipping_data,
  product_items,
  extraConfig,
}: {
  amount: number;
  currency: string;
  billing_data: Record<string, string>;
  shipping_data: Record<string, string>;
  product_items: ProductItem[];
  extraConfig?: Record<string, any>;
}): Promise<{ data: { id: string } }> {
  return axiosInstance.post('/payments/intent/', {
    amount,
    amount_currency: currency,
    billing_data,
    shipping_data,
    product_items,
    hide_form_header_message: true,
    hide_navigation_to_payment_methods: true,
    webhook_url: 'https://webhook.site/605f6773-6c1a-4711-bea2-21faca2211e1',
    successful_redirect_url: `${window.location.origin}/checkout/order`,
    failed_redirect_url: `${window.location.origin}/checkout/order`,
    pending_external_action_redirect_url: `${window.location.origin}/checkout/order`,
    back_url: `${window.location.origin}/checkout/order`,
    ...(!extraConfig?.flow_id && {
      operation: 'purchase',
      hidden_methods: ['APPLE_PAY'],
    }),
    ...extraConfig,
  });
}
