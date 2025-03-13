import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import { grabClient, validateSession } from '$lib/database/mongoEntry';

export const authMiddleware = async ({ cookies }: RequestEvent) => {
	const sessionToken = cookies.get('session');

	if (!sessionToken) {
		return new Response('Unauthorized', { status: 401 });
	}

	const client = await grabClient();
	const { user, error } = await validateSession(client, sessionToken);

	if (error || !user) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Add the user to the request event so it's available in the route handler
	return { user };
};
