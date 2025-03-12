import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { intialMigration } from '$lib/database/mongoEntry';

export const GET: RequestHandler = async ({ url }) => {
	await intialMigration();
	return new Response('Database migrated');
};
