import { NavBarItem } from '@rocket.chat/fuselage';
import { useEffectEvent } from '@rocket.chat/fuselage-hooks';
import { useRouter, useLayout, useCurrentRoutePath } from '@rocket.chat/ui-contexts';
import type { HTMLAttributes } from 'react';

type NavBarItemActivityHubProps = Omit<HTMLAttributes<HTMLElement>, 'is'>;

const NavBarItemActivityHub = (props: NavBarItemActivityHubProps) => {
	const router = useRouter();
	const { sidebar } = useLayout();
	const currentRoute = useCurrentRoutePath();

	const handleClick = useEffectEvent(() => {
		sidebar.toggle();
		router.navigate('/activity-hub');
	});

	return (
		<NavBarItem
			{...props}
			icon='bell'
			onClick={handleClick}
			pressed={currentRoute?.includes('/activity-hub')}
		/>
	);
};

export default NavBarItemActivityHub;