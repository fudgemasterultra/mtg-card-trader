import type { RequestHandler } from '@sveltejs/kit';
import { authMiddleware } from '$lib/middleware/auth';

export const GET: RequestHandler = async (event) => {
	// First, run the auth middleware
	const authResult = await authMiddleware(event);

	// If authResult is a Response, it means authentication failed
	if (authResult instanceof Response) {
		return authResult;
	}

	// authResult contains the user object
	const { user } = authResult;

	// Return the user data (excluding sensitive information)
	return new Response(
		JSON.stringify({
			id: user._id,
			email: user.email,
			username: user.username,
			createdAt: user.createdAt
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
