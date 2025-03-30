import { env } from '$env/dynamic/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import db from '$lib/db.server.js';
import webPush from 'web-push';

webPush.setVapidDetails('mailto:your@mail.com', PUBLIC_VAPID_KEY, env.VAPID_KEY);

export const actions = {
	async testPush({ request }) {
		const fd = await request.formData();
		const payload = JSON.stringify({
			title: fd.get('title')?.toString() || 'SvelteKit App',
			body: fd.get('body')?.toString() || 'Example push notification!'
		});

		for (const subscription of db.subscriptions) {
			await webPush.sendNotification(subscription, payload);
		}
	}
};
