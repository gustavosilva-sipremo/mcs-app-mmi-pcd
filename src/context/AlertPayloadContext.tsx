import type { EmergencyAlertData } from "@/features/alerts/content";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AlertPayloadContextType = {
  pendingAlert: EmergencyAlertData | null;
  setPendingAlert: (data: EmergencyAlertData | null) => void;
  clearPendingAlert: () => void;
};

const AlertPayloadContext = createContext<
  AlertPayloadContextType | undefined
>(undefined);

export function AlertPayloadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingAlert, setPendingAlert] =
    useState<EmergencyAlertData | null>(null);

  const clearPendingAlert = useCallback(() => {
    setPendingAlert(null);
  }, []);

  const value = useMemo(
    () => ({ pendingAlert, setPendingAlert, clearPendingAlert }),
    [pendingAlert, clearPendingAlert],
  );

  return (
    <AlertPayloadContext.Provider value={value}>
      {children}
    </AlertPayloadContext.Provider>
  );
}

export function useAlertPayload() {
  const ctx = useContext(AlertPayloadContext);
  if (!ctx) {
    throw new Error("useAlertPayload must be used within AlertPayloadProvider");
  }
  return ctx;
}
