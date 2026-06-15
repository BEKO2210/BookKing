import {
	type PaymentIntent,
	calculateDeposit,
	createPayPalOrder,
	createStripePaymentIntent,
	getPaymentConfig,
	isPaymentEnabled,
} from "@/lib/payment";
import { useCallback, useState } from "react";

export function usePayment() {
	const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
		null,
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const config = getPaymentConfig();
	const enabled = isPaymentEnabled();

	const processPayment = useCallback(
		async (amount: number) => {
			if (!enabled) return null;

			setIsProcessing(true);
			setError(null);

			try {
				const depositAmount = calculateDeposit(amount);
				const chargeAmount = depositAmount > 0 ? depositAmount : amount;

				let intent: PaymentIntent;
				if (config.provider === "stripe") {
					intent = await createStripePaymentIntent(
						chargeAmount,
						config.currency,
					);
				} else {
					intent = await createPayPalOrder(chargeAmount, config.currency);
				}

				setPaymentIntent(intent);
				return intent;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Zahlung fehlgeschlagen");
				return null;
			} finally {
				setIsProcessing(false);
			}
		},
		[enabled, config],
	);

	const reset = useCallback(() => {
		setPaymentIntent(null);
		setError(null);
		setIsProcessing(false);
	}, []);

	return {
		paymentEnabled: enabled,
		paymentIntent,
		isProcessing,
		error,
		processPayment,
		reset,
		calculateDeposit,
	};
}
