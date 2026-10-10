import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';

let stripePromise: Promise<StripeClient | null> | null = null;

export async function getStripeClient(): Promise<StripeClient | null> {
  if (!stripePromise) {
    try {
      const res = await fetch('/api/stripe-config');
      if (res.ok) {
        const data = await res.json();
        stripePromise = loadStripe(data.publishableKey || 'pk_test_poshpop_marketplace');
      } else {
        stripePromise = loadStripe('pk_test_poshpop_marketplace');
      }
    } catch (e) {
      console.warn('Could not load stripe config, using default public test key:', e);
      stripePromise = loadStripe('pk_test_poshpop_marketplace');
    }
  }
  return stripePromise;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  mode: string;
}

export async function createStripePaymentIntent(params: {
  amount: number;
  currency?: string;
  itemTitle: string;
  orderNumber: string;
}): Promise<PaymentIntentResult> {
  const res = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to initialize Stripe Payment Intent');
  }

  return await res.json();
}

/**
 * Format raw card number with spaces (e.g. 4242 4242 4242 4242)
 */
export function formatCardNumber(value: string): string {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = value.replace(/[^\d]/g, '');

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter(Boolean).join(' ')
  );
}

/**
 * Detect card network brand from number
 */
export function getCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic' {
  const clean = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^6(011|5)/.test(clean)) return 'discover';
  return 'generic';
}

/**
 * Format expiry (MM/YY)
 */
export function formatExpiry(value: string): string {
  const clean = value.replace(/[^\d]/g, '');
  if (clean.length >= 2) {
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  }
  return clean;
}
