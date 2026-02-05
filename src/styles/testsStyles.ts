import { StyleSheet } from "react-native";

export const testsStyles = StyleSheet.create({
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 24,
  },
  testGrid: {
    width: "100%",
    gap: 12,
  },
  buttonSecondary: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonTextSecondary: {
    color: "#475569",
  },
  // Cores semânticas para os testes de hardware
  btnSuccess: { backgroundColor: "#10b981" },
  btnError: { backgroundColor: "#ef4444" },
  btnAudio: { backgroundColor: "#6366f1" },
  btnFlashActive: { backgroundColor: "#f59e0b" },
});
