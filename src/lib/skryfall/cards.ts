import * as skryfall from 'scryfall-api';
import type { BulkDataList, MtgCard } from '$lib/types/mtg';
import { grabClient, addBulkCards } from '$lib/database/mongoEntry';

const callSkryFall = async <T>(
	url: string,
	{
		method,
		data,
		headers
	}: {
		method?: 'POST' | 'GET';
		data?: { [key: string]: string | number };
		headers?: { [key: string]: string };
	} = {}
): Promise<T> => {
	const payload: RequestInit = {
		method: method || 'GET',
		/* 
		These headers are just to comply with scryfall's API
		https://scryfall.com/docs/api
		*/
		headers: {
			Accept: 'application/json',
			'User-Agent': 'MTG-Trader-v1'
		}
	};
	if (headers) {
		payload.headers = { ...payload.headers, ...headers };
	}
	if (data) {
		payload.body = JSON.stringify(data);
	}
	const response = await fetch(url, payload);
	const reJson: T = await response.json();
	return reJson;
};

const refillDatabase = async () => {
	const { data } = await callSkryFall<BulkDataList>('https://api.scryfall.com/bulk-data');
	let defaultCardsUrl = '';
	for (const i of data) {
		if (i.type === 'default_cards') {
			defaultCardsUrl = i.download_uri;
		}
	}
	if (defaultCardsUrl === '') {
		throw Error('unable to get bulk data');
	}
	const cards = await callSkryFall<MtgCard[]>(defaultCardsUrl);
	const client = await grabClient();
	await addBulkCards(client, cards);
};

export { refillDatabase };
