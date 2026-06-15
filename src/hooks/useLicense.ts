import { useLicenseStore } from "@/store/license-store";
import { LICENSE_TIERS } from "@/types";
import type { LicenseTier } from "@/types";

/**
 * Hook for accessing license state and helpers in components.
 */
export function useLicense() {
	const store = useLicenseStore();
	const { license } = store;
	const tierConfig = LICENSE_TIERS[license.tier];

	const isFreeTier = license.tier === "free";
	const isUnlimited = license.bookingsLimit === -1;
	const remaining = store.bookingsRemaining();
	const canBook = store.canBook();
	const usagePercent = isUnlimited
		? 0
		: Math.round((license.bookingsUsed / license.bookingsLimit) * 100);

	const needsUpgrade = !canBook;
	const almostAtLimit = !isUnlimited && remaining <= 3 && remaining > 0;

	const nextTier: LicenseTier | null =
		license.tier === "free"
			? "starter"
			: license.tier === "starter"
				? "professional"
				: license.tier === "professional"
					? "business"
					: null;

	return {
		license,
		tierConfig,
		isFreeTier,
		isUnlimited,
		remaining,
		canBook,
		usagePercent,
		needsUpgrade,
		almostAtLimit,
		nextTier,
		incrementBookings: store.incrementBookings,
		upgradeTier: store.upgradeTier,
	};
}
