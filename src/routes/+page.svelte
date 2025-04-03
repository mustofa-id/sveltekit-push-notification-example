<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_VAPID_KEY } from '$env/static/public';
	import { getStorageState } from '$lib/storage.svelte';

	const title = 'SvelteKit Push Notification Example';
	const storage = getStorageState<'notification'>();

	async function enableNotification(): Promise<void> {
		if (!('Notification' in window)) return; // browser is not supported

		storage.notification = await Notification.requestPermission();
		if (storage.notification == 'granted') {
			await subscribeNotification().catch((e) => {
				console.error(e);
				storage.notification = 'error';
			});
		}
	}

	async function subscribeNotification(): Promise<void> {
		const registration = await navigator.serviceWorker.ready;
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

<!-- In real-world scenarios, enabling or disabling notifications
may also require handling on the server side -->

<button onclick={enableNotification} disabled={storage.notification == 'granted'}>
	Enable Notification
</button>

<p>Notification state: {storage.notification}</p>

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
