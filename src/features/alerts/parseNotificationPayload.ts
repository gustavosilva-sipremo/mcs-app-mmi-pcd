import type { EmergencyAlertData } from "@/features/alerts/content";

/** Maps FCM / Expo push `data` fields to an emergency payload. */
export function parseEmergencyAlertData(
  data: Record<string, unknown> | null | undefined,
): EmergencyAlertData | null {
  if (!data || typeof data !== "object") return null;

  const title = data.title != null ? String(data.title).trim() : "";
  const message = data.message != null ? String(data.message).trim() : "";
  if (!title || !message) return null;

  const level =
    data.level != null ? String(data.level).trim() : "Alerta";
  const structure =
    data.structure != null ? String(data.structure).trim() : "-";

  const sim = data.isSimulation;
  const efni = data.isEfni;

  return {
    level,
    structure,
    title,
    message,
    isSimulation: sim === true || sim === "true" || sim === "1",
    isEfni: efni === true || efni === "true" || efni === "1",
  };
}
