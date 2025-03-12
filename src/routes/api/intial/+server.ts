import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { intialMigration } from '$lib/database/mongoEntry';

export const GET: RequestHandler = async ({ url }) => {
	await intialMigration();
	return new Response('Database migrated');
};
