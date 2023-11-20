import axiosInstance from '.';

export default function createIntent({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}): Promise<{ data: { id: string } }> {
  return axiosInstance.post('/payments/intent/', {
    amount,
    amount_currency: currency,
    operation: 'purchase',
    webhook_url: 'https://webhook.site/605f6773-6c1a-4711-bea2-21faca2211e1',
  });
}
