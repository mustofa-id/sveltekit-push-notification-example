<script lang="ts">
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { getStorageState } from '$lib/storage.svelte';

	const title = 'SvelteKit Push Notification Example';
	const storage = getStorageState<'notification'>();

	async function enableNotification(): Promise<void> {
		if (!('Notification' in window)) return; // browser is not supported
		storage.notification = await Notification.requestPermission();
		if (storage.notification != 'granted') return;
		const swRegistration = await registerServiceWorker();
		await subscribeNotification(swRegistration);
	}

	async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
		const registration = await navigator.serviceWorker.register('/service-worker.js', {
			type: dev ? 'module' : 'classic'
		});
		return registration;
	}

	async function subscribeNotification(registration: ServiceWorkerRegistration): Promise<void> {
		await navigator.serviceWorker.ready; // need to wait until ready before subs to push manager
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_VAPID_KEY
		});

		await fetch(`/subscribe`, {
			method: 'POST',
			body: JSON.stringify(subscription)
		});
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>Welcome to {title}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button onclick={enableNotification} disabled={storage.notification == 'granted'}>
	Enable Notification
</button>

<p>Notification permission: {storage.notification}</p>

<form
	style="display: grid; gap: 0.5rem; max-width: 24rem;"
	action="?/testPush"
	method="post"
	use:enhance
>
	<input name="title" placeholder="Title" />
	<textarea name="body" rows="3" placeholder="Body"></textarea>
	<button disabled={storage.notification != 'granted'}>Test Push</button>
</form>
