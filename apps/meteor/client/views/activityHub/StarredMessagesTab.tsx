import type { IMessage } from '@rocket.chat/core-typings';
import { Box, MessageDivider } from '@rocket.chat/fuselage';
import { MessageTypes } from '@rocket.chat/message-types';
import { VirtualizedScrollbars } from '@rocket.chat/ui-client';
import { useEndpoint, useUserPreference } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import RoomMessage from '../../components/message/variants/RoomMessage';
import SystemMessage from '../../components/message/variants/SystemMessage';
import { useFormatDate } from '../../hooks/useFormatDate';
import { onClientMessageReceived } from '../../lib/onClientMessageReceived';
import { mapMessageFromApi } from '../../lib/utils/mapMessageFromApi';
import MessageListErrorBoundary from '../room/MessageList/MessageListErrorBoundary';
import { isMessageNewDay } from '../room/MessageList/lib/isMessageNewDay';
import MessageListProvider from '../room/MessageList/providers/MessageListProvider';

const StarredMessagesTab = () => {
	const { t } = useTranslation();
	const formatDate = useFormatDate();
	const showUserAvatar = !!useUserPreference<boolean>('displayAvatars');

	// @ts-expect-error - endpoints are not yet in rest-typings
	const getStarredMessages = useEndpoint('GET', '/v1/activity-hub.starredMessages');

	const queryResult = useQuery({
		queryKey: ['activity-hub', 'starred-messages'] as const,
		queryFn: async () => {
			const messages: IMessage[] = [];

			for (
				// @ts-expect-error - endpoints are not yet in rest-typings
				let offset = 0, result = await getStarredMessages({ offset: 0 });
				// @ts-expect-error - endpoints are not yet in rest-typings
				result.count > 0;
				// @ts-expect-error - endpoints are not yet in rest-typings
				offset += result.count, result = await getStarredMessages({ offset })
			) {
				// @ts-expect-error - endpoints are not yet in rest-typings
				messages.push(...result.messages.map(mapMessageFromApi));
			}

			return Promise.all(messages.map(onClientMessageReceived));
		},
	});

	if (queryResult.isLoading) return <Box p={24}>{t('Loading')}</Box>;
	if (!queryResult.data?.length) return <Box p={24}>{t('No_starred_messages')}</Box>;

	const messages = queryResult.data;

	return (
		<MessageListErrorBoundary>
			<MessageListProvider>
				<Box flexGrow={1} flexShrink={1} overflow='hidden' display='flex' flexDirection='column' height='full'>
					<VirtualizedScrollbars>
						<Virtuoso
							totalCount={messages.length}
							overscan={25}
							data={messages}
							itemContent={(index, message) => {
								const previous = messages[index - 1];
								const newDay = isMessageNewDay(message, previous);
								const system = MessageTypes.isSystemMessage(message);

								return (
									<>
										{newDay && <MessageDivider>{formatDate(message.ts)}</MessageDivider>}
										{system ? (
											<SystemMessage message={message} showUserAvatar={showUserAvatar} />
										) : (
											<RoomMessage
												message={message}
												sequential={false}
												unread={false}
												mention={false}
												all={false}
												context='starred'
												showUserAvatar={showUserAvatar}
											/>
										)}
									</>
								);
							}}
						/>
					</VirtualizedScrollbars>
				</Box>
			</MessageListProvider>
		</MessageListErrorBoundary>
	);
};

export default StarredMessagesTab;
