import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { intialMigration } from '$lib/database/mongoEntry';
import { refillDatabase } from '$lib/skryfall/cards';

export const GET: RequestHandler = async ({ url }) => {
	await intialMigration();
	await refillDatabase();
	return new Response('Database migrated');
};
