import type { Provider, ProviderSettings } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
	provider: Provider | null;
	isAuthenticated: boolean;
	sidebarOpen: boolean;
	isDarkMode: boolean;

	// Actions
	setProvider: (provider: Provider) => void;
	updateSettings: (settings: Partial<ProviderSettings>) => void;
	setAuthenticated: (auth: boolean) => void;
	toggleSidebar: () => void;
	setSidebarOpen: (open: boolean) => void;
	toggleDarkMode: () => void;
	logout: () => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			provider: null,
			isAuthenticated: false,
			sidebarOpen: true,
			isDarkMode: false,

			setProvider: (provider) => set({ provider, isAuthenticated: true }),

			updateSettings: (settings) =>
				set((state) => {
					if (!state.provider) return state;
					return {
						provider: {
							...state.provider,
							settings: { ...state.provider.settings, ...settings },
						},
					};
				}),

			setAuthenticated: (auth) => set({ isAuthenticated: auth }),
			toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
			setSidebarOpen: (open) => set({ sidebarOpen: open }),
			toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

			logout: () =>
				set({
					provider: null,
					isAuthenticated: false,
				}),
		}),
		{
			name: "bookking-settings",
			partialize: (state) => ({
				provider: state.provider,
				isAuthenticated: state.isAuthenticated,
				isDarkMode: state.isDarkMode,
			}),
		},
	),
);

/**
 * Default provider settings for new accounts.
 */
export const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
	minLeadTime: 2,
	maxLeadTime: 30,
	cancellationWindow: 24,
	noShowFee: undefined,
	depositPercent: undefined,
	reminderTimes: [1440, 120],
	slotInterval: 30,
	locale: "de",
	colorScheme: "service",
};

/**
 * Demo provider for development / first-time setup.
 */
export const DEMO_PROVIDER: Provider = {
	id: "demo-provider-001",
	name: "Max Mustermann",
	email: "max@bookking.demo",
	businessName: "BookKing Demo Salon",
	businessType: "friseur",
	bookingSlug: "demo-salon",
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	currency: "EUR",
	settings: DEFAULT_PROVIDER_SETTINGS,
	createdAt: new Date().toISOString(),
};
