import type { IMessage } from '@rocket.chat/core-typings';
import { Messages } from '@rocket.chat/models';
import type { FindOptions } from 'mongodb';

type FindAllStarredMessagesByUserParams = {
	uid: string;
	pagination: {
		offset: number;
		count: number;
		sort?: Record<string, 1 | -1>;
	};
};

export async function findAllStarredMessagesByUser({
	uid,
	pagination: { offset, count, sort },
}: FindAllStarredMessagesByUserParams): Promise<{ messages: IMessage[]; total: number }> {
	const options: FindOptions<IMessage> = {
		sort: sort ?? { ts: -1 },
		skip: offset,
		limit: count,
	};

	const { cursor, totalCount } = Messages.findPaginatedStarredByUserId(uid, options);

	const [messages, total] = await Promise.all([cursor.toArray(), totalCount]);

	return { messages, total };
}
