import type { RequestHandler } from '@sveltejs/kit';
import { grabClient, createUser } from '$lib/database/mongoEntry';
export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = (await request.json()) as { email: string; password: string };
	const client = await grabClient();
	const { user, error } = await createUser(client, email, password);
	if (error || !user) {
		return new Response(JSON.stringify({ error: error || 'Failed to create user' }), {
			status: 400
		});
	}
	return new Response(JSON.stringify({ email: user.email }), { status: 200 });
};
