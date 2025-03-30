/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (e) => {
	const data = e.data?.json();
	console.log(data);
	sw.registration.showNotification(data?.title, {
		icon: '/favicon.png',
		badge: '/favicon.png',
		body: data?.body
	});
});
