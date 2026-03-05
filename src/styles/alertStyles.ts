import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  scanline: {
    position: "absolute",
    width: "100%",
    height: 120,
    zIndex: 5,
  },

  alertContent: {
    alignItems: "center",
    zIndex: 10,
  },

  alertSubtitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 20,
  },

  alertTitle: {
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
  },

  dangerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    borderRadius: 6,
    borderWidth: 2,
  },

  dangerText: {
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 32,
    zIndex: 11,
  },

  primaryButton: {
    height: 75,
    borderRadius: 16,
  },

  primaryButtonText: {
    fontWeight: "900",
    fontSize: 18,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
  },

  modalSub: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  divider: {
    height: 2,
    marginVertical: 20,
  },

  infoItem: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: 20,
    borderWidth: 1,
  },

  dangerButton: {
    marginTop: 12,
  },

  dangerButtonText: {
    fontWeight: "700",
  },

  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
