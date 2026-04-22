import { parseEmergencyAlertData } from "@/features/alerts/parseNotificationPayload";
import { EMERGENCY_NOTIFICATION_CHANNEL_ID } from "@/features/alerts/pushConstants";
import { useAlertPayload } from "@/context/AlertPayloadContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import type { Notification, NotificationResponse } from "expo-notifications";

function getDataFromResponse(
  response: NotificationResponse,
): Record<string, unknown> | undefined {
  const raw = response.notification.request.content.data;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return undefined;
}

function getDataFromNotification(
  notification: Notification,
): Record<string, unknown> | undefined {
  const raw = notification.request.content.data;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return undefined;
}

/**
 * Remote push (FCM/Expo) is not available inside Expo Go on Android as of SDK 53+.
 * Use a dev build: `npx expo run:android` or EAS "development" profile.
 */
function shouldSkipPushModule(): boolean {
  return (
    Platform.OS === "android" && Constants.appOwnership === "expo"
  );
}

/**
 * Registers push listeners, Android channel, permission, and Expo push token (log only).
 * Navigates to /alert when a notification with valid `data` is opened or received in foreground.
 */
export function useEmergencyNotifications() {
  const router = useRouter();
  const { setPendingAlert } = useAlertPayload();
  const handledColdStart = useRef(false);

  useEffect(() => {
    if (Platform.OS === "web") return;

    if (shouldSkipPushModule()) {
      if (__DEV__) {
        console.warn(
          "[notifications] Remote push is disabled in Expo Go on Android (SDK 53+). " +
            "Use a development build to test FCM/Expo push.",
        );
      }
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Notifications = require("expo-notifications") as typeof import("expo-notifications");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    let responseSub: { remove: () => void } | undefined;
    let receivedSub: { remove: () => void } | undefined;

    const navigateToAlert = (data: Record<string, unknown> | undefined) => {
      const parsed = parseEmergencyAlertData(data);
      if (!parsed) return;
      setPendingAlert(parsed);
      router.replace("/alert");
    };

    const handleResponse = (response: NotificationResponse | null) => {
      if (!response) return;
      const data = getDataFromResponse(response);
      navigateToAlert(data);
      void Notifications.clearLastNotificationResponseAsync();
    };

    (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          EMERGENCY_NOTIFICATION_CHANNEL_ID,
          {
            name: "Emergência",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            sound: "default",
            enableVibrate: true,
            bypassDnd: false,
          },
        );
      }

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (projectId && typeof projectId === "string") {
        try {
          const token = await Notifications.getExpoPushTokenAsync({
            projectId,
          });
          if (__DEV__) {
            console.log("[notifications] Expo push token", token.data);
          }
        } catch (e) {
          console.warn("[notifications] getExpoPushTokenAsync failed", e);
        }
      } else if (__DEV__) {
        console.warn(
          "[notifications] Missing EAS projectId in app.json extra.eas.projectId — Expo push token not fetched.",
        );
      }

      const last = await Notifications.getLastNotificationResponseAsync();
      if (last && !handledColdStart.current) {
        handledColdStart.current = true;
        handleResponse(last);
      }

      responseSub = Notifications.addNotificationResponseReceivedListener(
        (event: NotificationResponse) => {
          handleResponse(event);
        },
      );

      receivedSub = Notifications.addNotificationReceivedListener(
        (notification: Notification) => {
          const data = getDataFromNotification(notification);
          navigateToAlert(data);
        },
      );
    })();

    return () => {
      responseSub?.remove();
      receivedSub?.remove();
    };
  }, [router, setPendingAlert]);
}
