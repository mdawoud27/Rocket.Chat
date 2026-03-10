import { Box, Tabs } from '@rocket.chat/fuselage';
import { Page, PageHeader, PageScrollableContent } from '@rocket.chat/ui-client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import NotificationHistoryTab from './NotificationHistoryTab';
import StarredMessagesTab from './StarredMessagesTab';

type TabId = 'notifications' | 'starred';

const ActivityHubPage = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<TabId>('notifications');

	return (
		<Page>
			<PageHeader title={t('Activity_Hub')} />
			<PageScrollableContent>
				<Box display='flex' flexDirection='column' height='full'>
					<Tabs>
						<Tabs.Item selected={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
							{t('Notification_History')}
						</Tabs.Item>
						<Tabs.Item selected={activeTab === 'starred'} onClick={() => setActiveTab('starred')}>
							{t('Starred_Messages')}
						</Tabs.Item>
					</Tabs>

					<Box flexGrow={1} overflow='hidden'>
						{activeTab === 'notifications' && <NotificationHistoryTab />}
						{activeTab === 'starred' && <StarredMessagesTab />}
					</Box>
				</Box>
			</PageScrollableContent>
		</Page>
	);
};

export default ActivityHubPage;
