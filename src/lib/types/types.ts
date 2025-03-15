import type { ObjectId } from 'mongodb';
import type { MtgCard } from './mtg';
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
} & MtgCard;

export type Session = {
	_id: ObjectId;
	userId: ObjectId;
	token: string;
	createdAt: Date;
	updatedAt: Date;
};
