/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Handle push notifications in the service worker
self.addEventListener("push", (event) => {
	const data = event.data?.json() ?? {};

	const title = data.title ?? "BookKing";
	const options: NotificationOptions = {
		body: data.body ?? "Neue Benachrichtigung",
		icon: "/icons/icon-192.png",
		badge: "/icons/icon-192.png",
		tag: data.tag ?? `bookking-${Date.now()}`,
		data: data.url ?? "/",
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const url = (event.notification.data as string) ?? "/";

	event.waitUntil(
		self.clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url.includes(url) && "focus" in client) {
						return client.focus();
					}
				}
				return self.clients.openWindow(url);
			}),
	);
});

export {};
