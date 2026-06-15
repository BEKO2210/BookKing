import type { LicenseInfo, LicenseTier } from "@/types";
import { LICENSE_TIERS } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LicenseState {
	license: LicenseInfo;

	// Actions
	incrementBookings: () => void;
	upgradeTier: (tier: LicenseTier) => void;
	resetMonthlyBookings: () => void;
	canBook: () => boolean;
	bookingsRemaining: () => number;
}

const DEFAULT_LICENSE: LicenseInfo = {
	tier: "free",
	bookingsUsed: 0,
	bookingsLimit: LICENSE_TIERS.free.bookingsLimit,
	staffLimit: LICENSE_TIERS.free.staffLimit,
	activatedAt: new Date().toISOString(),
};

export const useLicenseStore = create<LicenseState>()(
	persist(
		(set, get) => ({
			license: DEFAULT_LICENSE,

			incrementBookings: () =>
				set((state) => ({
					license: {
						...state.license,
						bookingsUsed: state.license.bookingsUsed + 1,
					},
				})),

			upgradeTier: (tier: LicenseTier) => {
				const tierConfig = LICENSE_TIERS[tier];
				set((state) => ({
					license: {
						...state.license,
						tier,
						bookingsLimit: tierConfig.bookingsLimit,
						staffLimit: tierConfig.staffLimit,
						bookingsUsed: tier === "free" ? state.license.bookingsUsed : 0,
						validUntil:
							tier === "free"
								? undefined
								: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
						activatedAt: new Date().toISOString(),
					},
				}));
			},

			resetMonthlyBookings: () =>
				set((state) => {
					// Free tier bookings are cumulative (lifetime), not monthly
					if (state.license.tier === "free") return state;
					return {
						license: { ...state.license, bookingsUsed: 0 },
					};
				}),

			canBook: () => {
				const { license } = get();
				// Unlimited tiers
				if (license.bookingsLimit === -1) return true;
				return license.bookingsUsed < license.bookingsLimit;
			},

			bookingsRemaining: () => {
				const { license } = get();
				if (license.bookingsLimit === -1) return Number.POSITIVE_INFINITY;
				return Math.max(0, license.bookingsLimit - license.bookingsUsed);
			},
		}),
		{
			name: "bookking-license",
			partialize: (state) => ({
				license: state.license,
			}),
		},
	),
);
