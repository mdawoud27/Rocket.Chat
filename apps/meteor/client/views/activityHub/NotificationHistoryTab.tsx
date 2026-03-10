import { Box, Button, Icon, Throbber } from '@rocket.chat/fuselage';
import { useToastMessageDispatch } from '@rocket.chat/ui-contexts';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useNotificationHistory } from './hooks/useNotificationHistory';

const NotificationHistoryTab = () => {
	const { t } = useTranslation();
	const toast = useToastMessageDispatch();
	const queryClient = useQueryClient();
	const { queryResult, deleteNotification, clearNotifications } = useNotificationHistory();

	const handleDelete = async (notificationId: string) => {
		try {
			// @ts-expect-error - endpoints are not yet in rest-typings
			await deleteNotification({ notificationId });
			queryClient.invalidateQueries({ queryKey: ['activity-hub', 'notifications'] });
		} catch {
			toast({ type: 'error', message: t('Error_deleting_notification') });
		}
	};

	const handleClearAll = async () => {
		try {
			// @ts-expect-error - endpoints are not yet in rest-typings
			await clearNotifications({});
			queryClient.invalidateQueries({ queryKey: ['activity-hub', 'notifications'] });
		} catch {
			toast({ type: 'error', message: t('Error_clearing_notifications') });
		}
	};

	if (queryResult.isLoading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='full'>
				<Throbber />
			</Box>
		);
	}

	if (queryResult.isError) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='full'>
				<Box color='danger'>{t('Error_loading_notifications')}</Box>
			</Box>
		);
	}

	/* @ts-expect-error */
	const notifications = queryResult.data?.notifications ?? [];

	if (notifications.length === 0) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='full' color='hint'>
				{t('No_notifications')}
			</Box>
		);
	}

	return (
		<Box display='flex' flexDirection='column' height='full' overflow='hidden'>
			<Box display='flex' justifyContent='flex-end' p='x16' borderBlockEndWidth='x1' borderBlockEndColor='extra-light'>
				<Button small danger onClick={handleClearAll}>
					<Icon name='trash' size='x16' mie='x4' />
					{t('Clear_all')}
				</Button>
			</Box>
			<Box overflowY='auto' flexGrow={1}>
				{notifications.map((notification: any) => (
					<Box
						key={notification._id}
						display='flex'
						alignItems='flex-start'
						p='x16'
						borderBlockEndWidth='x1'
						borderBlockEndColor='extra-light'
					>
						<Box flexGrow={1}>
							<Box fontScale='p2m' mbe='x4'>
								{notification.roomName ?? notification.roomId}
							</Box>
							<Box fontScale='p2' color='hint'>
								{notification.message}
							</Box>
						</Box>
						<Button small square onClick={() => handleDelete(notification._id)} aria-label={t('Delete')}>
							<Icon name='cross' size='x16' />
						</Button>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default NotificationHistoryTab;
