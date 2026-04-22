import { useEmergencyNotifications } from "@/hooks/useEmergencyNotifications";

/**
 * Mounts notification permission, FCM/Expo listeners, and cold-start handling.
 * Renders nothing.
 */
export function NotificationBootstrap() {
  useEmergencyNotifications();
  return null;
}
