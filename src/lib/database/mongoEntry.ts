import { MongoClient, Db, ObjectId } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
import type { User, Card, Session } from '$lib/types/types';
import type { MtgCard } from '$lib/types/mtg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const uri = MONGODB_URI;
const client = new MongoClient(uri);
const mongoMtgCardTrader = 'mtg-card-trader';
const mongoUsers = 'users';
const mongoSessions = 'sessions';
const mongoCards = 'cards';
async function connectToDatabase() {
	try {
		return await client.connect();
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
}
async function hashPassword(password: string): Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}

async function userExists(client: MongoClient, { email, id }: { email?: string; id?: string }) {
	const db = client.db(mongoMtgCardTrader);
	const collection = db.collection<User>(mongoUsers);
	if (email) {
		const user = await collection.findOne({ email });
		return user;
	} else if (id) {
		const user = await collection.findOne({ _id: new ObjectId(id) });
		return user;
	}
	return undefined;
}

async function addBulkCards(client: MongoClient, cards: MtgCard[]) {
	const db = client.db(mongoMtgCardTrader);
	const collection = db.collection<Card>(mongoCards);
	const cardsToInsert: Card[] = [];
	for (const card of cards) {
		const foundCard = await collection.findOne({ oracle_id: card.oracle_id });
		if (foundCard !== null) {
			continue;
		}
		cardsToInsert.push({
			_id: new ObjectId(),
			...card
		});
	}
	await collection.insertMany(cardsToInsert);
}

async function createUser(
	client: MongoClient,
	email: string,
	password: string
): Promise<{ user?: User; error?: string }> {
	const db = client.db(mongoMtgCardTrader);
	const collection = db.collection<User>(mongoUsers);
	const exsists = await userExists(client, { email: email });
	const hashedPassword = await hashPassword(password);
	if (exsists) {
		return { error: 'User already exists' };
	}
	const user: User = {
		_id: new ObjectId(),
		email: email,
		password: hashedPassword,
		createdAt: new Date(),
		updatedAt: new Date(),
		username: email
	};
	const userResult = await collection.insertOne(user);
	return {
		user: userResult.acknowledged ? user : undefined,
		error: userResult.acknowledged ? undefined : 'Failed to create user'
	};
}

async function validateSession(client: MongoClient, token: string) {
	const db = client.db(mongoMtgCardTrader);
	const collection = db.collection<Session>(mongoSessions);
	const session = await collection.findOne({ token });
	if (!session) {
		return { error: 'Invalid session' };
	}
	const user = await userExists(client, { id: session.userId.toString() });
	if (!user) {
		return { error: 'User not found' };
	}
	return { user };
}

async function createSession(client: MongoClient, userId: string) {
	const db = client.db(mongoMtgCardTrader);
	const collection = db.collection<Session>(mongoSessions);
	const session: Session = {
		_id: new ObjectId(),
		userId: new ObjectId(userId),
		createdAt: new Date(),
		updatedAt: new Date(),
		token: crypto.randomBytes(32).toString('hex')
	};
	const sessionResult = await collection.insertOne(session);
	return session.token;
}

async function loginUser(client: MongoClient, email: string, password: string) {
	const user = await userExists(client, { email });
	if (!user) {
		return { error: 'User not found' };
	}
	const passwordMatch = await comparePasswords(password, user.password);
	if (!passwordMatch) {
		return { error: 'Invalid password' };
	}
	const token = await createSession(client, user._id.toString());
	return { user, token };
}

async function intialMigration() {
	const client = await connectToDatabase();
	const db = client.db(mongoMtgCardTrader);
	db.createCollection(mongoUsers);
	await db.createCollection(mongoSessions);
	await db.collection(mongoSessions).createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 72 * 60 * 60 } // sessions will be deleted after 72 hours
	);
	db.createCollection(mongoCards);
}

async function grabClient() {
	return await connectToDatabase();
}

export { intialMigration, grabClient, createUser, loginUser, validateSession, addBulkCards };
