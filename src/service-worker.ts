/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

// experimental: afaik only supported by chrome based browser
// see: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#actions
interface NotificationAction {
	action: string;
	title: string;
	icon?: string;
}

sw.addEventListener('push', (e) => {
	const notification = e.data?.json() || {};
	const options: NotificationOptions & { actions: NotificationAction[] } = {
		icon: '/favicon.png',
		badge: '/favicon.png',
		body: notification.body || '',
		data: notification.data || {},
		requireInteraction: true,
		actions: [
			{ action: 'open', title: 'Open' },
			{ action: 'dismiss', title: 'Dismiss' }
		]
	};
	e.waitUntil(sw.registration.showNotification(notification.title, options));
});

sw.addEventListener('notificationclick', (e) => {
	e.notification.close();

	if (e.action == 'open') {
		const targetUrl = e.notification.data.url;
		if (targetUrl) e.waitUntil(sw.clients.openWindow(targetUrl));
	}
});
