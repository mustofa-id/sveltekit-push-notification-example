import { env } from '$env/dynamic/private';
import { PUBLIC_VAPID_KEY } from '$env/static/public';
import db from '$lib/db.server.js';
import webPush, { WebPushError } from 'web-push';

webPush.setVapidDetails('mailto:your@mail.com', PUBLIC_VAPID_KEY, env.VAPID_KEY);

export const actions = {
	async testPush({ request }) {
		const fd = await request.formData();
		const payload = JSON.stringify({
			title: fd.get('title')?.toString() || 'SvelteKit App',
			body: fd.get('body')?.toString() || 'Example push notification!',
			data: { url: '/' }
		});

		for (const subscription of db.subscriptions) {
			await webPush.sendNotification(subscription, payload).catch((e) => {
				if (e instanceof WebPushError) {
					if (e.statusCode == 410) {
						// invalid subs like unsubscribed or expired
						const index = db.subscriptions.indexOf(subscription);
						db.subscriptions.splice(index, 1);
						return;
					}
				}
				console.error(e);
			});
		}
	}
};
