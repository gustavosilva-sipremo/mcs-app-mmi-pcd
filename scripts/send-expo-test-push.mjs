#!/usr/bin/env node
/**
 * Sends a test notification via Expo Push API (not Firebase Console).
 * Expects the same `data` shape as parseEmergencyAlertData in the app.
 *
 * Usage (from project root):
 *   EXPO_PUSH_TOKEN="ExponentPushToken[...]" node scripts/send-expo-test-push.mjs
 */
const token = process.env.EXPO_PUSH_TOKEN;
if (!token || token.trim() === "") {
  console.error(
    "Set EXPO_PUSH_TOKEN to the full value from Metro logs, e.g.\n" +
      '  EXPO_PUSH_TOKEN="ExponentPushToken[xxxxxxxx]" node scripts/send-expo-test-push.mjs',
  );
  process.exit(1);
}

const body = {
  to: token,
  title: "Teste MMI",
  body: "Toque para abrir o app",
  data: {
    level: "Nivel 3",
    structure: "B1 Ipe",
    title: "Ruptura da Barragem",
    message: "Alerta de teste. Texto do protocolo aqui.",
  },
};

const res = await fetch("https://exp.host/--/api/v2/push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const text = await res.text();
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  parsed = text;
}
console.log(res.status, typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2));

const inner = parsed && typeof parsed === "object" ? parsed.data : undefined;
const errStatus =
  inner && typeof inner === "object" && "status" in inner
    ? inner.status
    : Array.isArray(inner) && inner[0]?.status
      ? inner[0].status
      : null;

if (!res.ok || errStatus === "error") {
  const msg =
    inner && typeof inner === "object" && "message" in inner
      ? String(inner.message)
      : "";
  if (
    msg.includes("FCM") ||
    inner?.details?.error === "InvalidCredentials"
  ) {
    console.error(`
[push:test] Expo cannot send to Android until FCM is configured for this project in EAS.

  1. Run:  eas credentials -p android
  2. Set up Push Notifications / FCM (HTTP v1): upload your Google Cloud
     service account JSON (same Firebase/GCP project as google-services.json).

  Docs: https://docs.expo.dev/push-notifications/push-notifications-setup/
`);
  }
  process.exit(1);
}
