import type { LayoutServerLoad } from './$types';
import { authMiddleware } from '$lib/middleware/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (requestEvent) => {
	const authResult = await authMiddleware(requestEvent);
	if (authResult instanceof Response) {
		throw redirect(401, '/login');
	}

	const { user } = authResult;
	const { email, username } = user;
	return {
		email,
		username
	};
};
