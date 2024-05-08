import axiosInstance from '.';

type ProductItem = {
  name: string;
  description: string;
  amount: number;
  quantity: number;
};
export default function createIntent({
  amount,
  currency,
  billing_data,
  shipping_data,
  product_items,
  ...rest
}: {
  amount: number;
  currency: string;
  billing_data: Record<string, string>;
  product_items: ProductItem[];
  [key: string]: unknown;
}): Promise<{ data: { id: string } }> {
  return axiosInstance.post('/payments/intent/', {
    amount,
    amount_currency: currency,
    billing_data,
    product_items,
    hide_form_header_message: true,
    webhook_url: 'https://webhook.site/605f6773-6c1a-4711-bea2-21faca2211e1',
    // operation: 'purchase',
    flow_id: 'A9ejXLm', // TODO: production flow_id
    ...rest,
  });
}
