import { useEndpoint } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';

export const useNotificationHistory = () => {
	// @ts-expect-error - endpoints are not yet in rest-typings
	const getNotifications = useEndpoint('GET', '/v1/activity-hub.notifications');
	// @ts-expect-error - endpoints are not yet in rest-typings
	const deleteNotification = useEndpoint('DELETE', '/v1/activity-hub.notifications');
	// @ts-expect-error - endpoints are not yet in rest-typings
	const clearNotifications = useEndpoint('DELETE', '/v1/activity-hub.notifications.clear');

	const queryResult = useQuery({
		queryKey: ['activity-hub', 'notifications'] as const,
		// @ts-expect-error - endpoints are not yet in rest-typings
		queryFn: () => getNotifications({ count: 50, offset: 0 }),
	});

	return { queryResult, deleteNotification, clearNotifications };
};
