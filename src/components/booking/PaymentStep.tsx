import { usePayment } from "@/hooks/usePayment";
import { formatPrice as fmtPrice } from "@/lib/payment";
import { CreditCard, Lock } from "lucide-react";
import { useEffect } from "react";

interface PaymentStepProps {
	amount: number;
	currency: string;
	onSuccess: () => void;
	onSkip: () => void;
}

export function PaymentStep({
	amount,
	currency,
	onSuccess,
	onSkip,
}: PaymentStepProps) {
	const {
		paymentEnabled,
		isProcessing,
		error,
		processPayment,
		calculateDeposit,
	} = usePayment();

	// Skip payment step if not enabled — must be in useEffect, not during render
	useEffect(() => {
		if (!paymentEnabled) {
			onSkip();
		}
	}, [paymentEnabled, onSkip]);

	if (!paymentEnabled) {
		return null;
	}

	const deposit = calculateDeposit(amount);
	const chargeAmount = deposit > 0 ? deposit : amount;

	const handlePay = async () => {
		const result = await processPayment(amount);
		if (result) {
			onSuccess();
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">Zahlung</h2>
			<p className="text-gray-500 mb-6">
				{deposit > 0
					? `Eine Anzahlung von ${fmtPrice(deposit, currency)} ist erforderlich.`
					: `Gesamtbetrag: ${fmtPrice(amount, currency)}`}
			</p>

			<div className="card p-6 mb-6">
				<div className="flex items-center justify-between mb-6">
					<span className="text-gray-600">Zu zahlen</span>
					<span className="text-2xl font-bold text-gray-900">
						{fmtPrice(chargeAmount, currency)}
					</span>
				</div>

				{/* Stripe Elements placeholder */}
				<div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4">
					<CreditCard size={32} className="mx-auto text-gray-300 mb-3" />
					<p className="text-sm text-gray-400">
						Stripe Elements / PayPal Button wird hier eingebettet
					</p>
					<p className="text-xs text-gray-300 mt-1">
						Integration über Stripe Payment Intent API oder PayPal SDK
					</p>
				</div>

				{error && <p className="text-sm text-red-500 mb-4">{error}</p>}

				<button
					type="button"
					onClick={handlePay}
					disabled={isProcessing}
					className="btn-primary w-full flex items-center justify-center gap-2"
				>
					{isProcessing ? (
						<>
							<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Verarbeitung...
						</>
					) : (
						<>
							<Lock size={16} />
							{fmtPrice(chargeAmount, currency)} bezahlen
						</>
					)}
				</button>

				<div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
					<Lock size={12} />
					Sichere Zahlung via Stripe
				</div>
			</div>
		</div>
	);
}
