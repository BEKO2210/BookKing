// ═══════════════════════════════════════════
// BookKing — Payment Integration (Stripe & PayPal Ready)
// ═══════════════════════════════════════════

export interface PaymentConfig {
  provider: 'stripe' | 'paypal' | 'none';
  stripePublishableKey?: string;
  paypalClientId?: string;
  depositPercent?: number;
  currency: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
}

const config: PaymentConfig = {
  provider: 'none',
  currency: 'EUR',
};

export function initPayment(cfg: Partial<PaymentConfig>): void {
  Object.assign(config, cfg);
}

export function isPaymentEnabled(): boolean {
  return config.provider !== 'none';
}

export function getPaymentConfig(): PaymentConfig {
  return { ...config };
}

/**
 * Calculate deposit amount based on total price and configured deposit percent.
 */
export function calculateDeposit(totalPrice: number): number {
  if (!config.depositPercent || config.depositPercent <= 0) return 0;
  return Math.round(totalPrice * (config.depositPercent / 100) * 100) / 100;
}

/**
 * Format a price for display.
 */
export function formatPrice(amount: number, currency?: string): string {
  const cur = currency ?? config.currency;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: cur,
  }).format(amount);
}

/**
 * Stripe: Create a payment intent on the client side.
 * In production, this would call your backend API to create a Stripe PaymentIntent.
 */
export async function createStripePaymentIntent(
  amount: number,
  currency: string,
): Promise<PaymentIntent> {
  // In production, this calls your backend:
  // const response = await fetch('/api/create-payment-intent', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount: Math.round(amount * 100), currency }),
  // });
  // return response.json();

  console.log(`[Stripe Ready] Would create payment intent: ${amount} ${currency}`);
  return {
    id: `pi_demo_${Date.now()}`,
    amount,
    currency,
    status: 'pending',
  };
}

/**
 * PayPal: Create an order on the client side.
 * In production, this would use the PayPal SDK to create an order.
 */
export async function createPayPalOrder(
  amount: number,
  currency: string,
): Promise<PaymentIntent> {
  console.log(`[PayPal Ready] Would create order: ${amount} ${currency}`);
  return {
    id: `pp_demo_${Date.now()}`,
    amount,
    currency,
    status: 'pending',
  };
}

/**
 * Process a refund for a cancelled booking.
 */
export async function processRefund(
  paymentId: string,
  amount: number,
): Promise<boolean> {
  console.log(`[Payment] Would refund ${amount} for payment ${paymentId}`);
  return true;
}
