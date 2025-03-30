import db from '$lib/db.server.js';

export async function POST({ request }) {
	const subscription: WebPushSubscription = await request.json();
	db.subscriptions.push(subscription);
	return new Response(null, { status: 201 });
}
