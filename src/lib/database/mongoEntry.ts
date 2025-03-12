import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
const uri = MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
	try {
		return await client.connect();
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
}

export async function intialMigration() {
	const client = await connectToDatabase();
	const db = client.db('mtg-card-trader');
	db.createCollection('users');
	await db.createCollection('sessions');
	await db.collection('sessions').createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 72 * 60 * 60 } // sessions will be deleted after 72 hours
	);
	db.createCollection('cards');
}
