import type { RequestHandler } from '@sveltejs/kit';
import { grabClient, loginUser } from '$lib/database/mongoEntry';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = (await request.json()) as { email: string; password: string };
	const client = await grabClient();
	const { user, error, token } = await loginUser(client, email, password);
	if (error || !user || !token) {
		return new Response(error || 'Failed to login', { status: 400 });
	}
	//create a secure cookie with the token
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 72 * 60 * 60 // 72 hours
	});
	return new Response(JSON.stringify({ email: user.email }), { status: 200 });
};
