import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallState {
	canInstall: boolean;
	isInstalled: boolean;
	install: () => Promise<boolean>;
	dismiss: () => void;
}

export function usePWAInstall(): PWAInstallState {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Check if already installed
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as unknown as { standalone?: boolean }).standalone ===
				true;

		if (isStandalone) {
			setIsInstalled(true);
			return;
		}

		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		const installedHandler = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};

		window.addEventListener("beforeinstallprompt", handler);
		window.addEventListener("appinstalled", installedHandler);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			window.removeEventListener("appinstalled", installedHandler);
		};
	}, []);

	const install = useCallback(async () => {
		if (!deferredPrompt) return false;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		setDeferredPrompt(null);
		return outcome === "accepted";
	}, [deferredPrompt]);

	const dismiss = useCallback(() => {
		setDeferredPrompt(null);
	}, []);

	return {
		canInstall: deferredPrompt !== null,
		isInstalled,
		install,
		dismiss,
	};
}
