// 1. Pure type definitions — no logic, no imports from app code
// Layer 2 — Handler in apps/meteor/app/activity-hub/server/handlers/getNotifications.ts
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";

// This is what enables auto-generated OpenAPI docs
export type ActivityHubEndpoints = {
	'/v1/activity-hub.notifications': {
		GET: {
			params: { count?: number; offset?: number };
			response: {
				// notifications: INotificationHistory[];
				total: number;
				offset: number;
				count: number;
			};
		};
		DELETE: {
			params: { notificationId: string };
			response: { success: boolean };
		};
	};
	'/v1/activity-hub.notifications.clearAll': {
		DELETE: {
			params: Record<string, never>;
			response: { success: boolean };
		};
	};
	'/v1/activity-hub.starredMessages': {
		GET: {
			params: { count?: number; offset?: number };
			response: {
				messages: IMessage[];
				total: number;
			};
		};
	};
};
