import { InfoFormValues } from '@/components/checkout';
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
  methodId,
  amount,
  currency,
  userInfo,
  product_items,
  extraConfig,
}: {
  methodId?: string;
  amount: number;
  currency: string;
  userInfo: InfoFormValues;
  product_items: ProductItem[];
  extraConfig?: Record<string, any>;
  operation?: string;
}): Promise<{ data: { id: string } }> {
  return axiosInstance.post('/payments/intent/', {
    payment_method: methodId,
    amount,
    amount_currency: currency,
    billing_data: {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      address: userInfo.address,
      city: userInfo.city,
      state: userInfo.state,
      postal_code: userInfo.postal_code,
    },
    shipping_data: {
      address: userInfo.address,
      city: userInfo.city,
      state: userInfo.state,
      postal_code: userInfo.postal_code,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      phone_number: userInfo.phone_number,
      shipping_method: 'EM',
      email: userInfo.email,
      apartment: '803',
      building: '8028',
      description: 'Second building',
      country: 'SA',
      street: 'street name',
      floor: 1,
    },
    product_items,
    form_only: true,
    hide_loader_message: true,
    ...(methodId === 'CARD' ? { threeds: { enabled: true } } : {}),
    webhook_url: 'https://webhook.site/605f6773-6c1a-4711-bea2-21faca2211e1',
    successful_redirect_url: `${'https://shop.moneyhash.io'}/checkout/order`,
    failed_redirect_url: `${'https://shop.moneyhash.io'}/checkout/order`,
    pending_external_action_redirect_url: `${'https://shop.moneyhash.io'}/checkout/order`,
    back_url: `${'https://shop.moneyhash.io'}/checkout/order`,
    redirect_branding_data: {
      icon: 'https://shop.moneyhash.io/images/moneyhash-logo.png',
      background_color: 'white',
      animate: 'pulse',
    },
    ...(!extraConfig?.flow_id && {
      operation: authorizedMethods.includes(methodId!)
        ? 'authorize'
        : 'purchase',
    }),
    ...extraConfig,
  });
}

const authorizedMethods = ['TABBY', 'TAMARA'];
