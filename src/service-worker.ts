/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (e) => {
	const notification = e.data?.json() || {};
	const options: NotificationOptions = {
		icon: '/favicon.png',
		badge: '/favicon.png',
		body: notification.body || '',
		data: notification.data || {}
	};
	e.waitUntil(sw.registration.showNotification(notification.title, options));
});

sw.addEventListener('notificationclick', (e) => {
	e.notification.close();
	const targetUrl = e.notification.data.url;
	if (targetUrl) e.waitUntil(sw.clients.openWindow(targetUrl));
});
