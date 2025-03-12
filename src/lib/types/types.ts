import type { ObjectId } from 'mongodb';

export type User = {
	_id: ObjectId;
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Card = {
	_id: ObjectId;
	name: string;
	imageUrl: string;
};

export type Session = {
	_id: ObjectId;
	userId: ObjectId;
	token: string;
	createdAt: Date;
	updatedAt: Date;
};
