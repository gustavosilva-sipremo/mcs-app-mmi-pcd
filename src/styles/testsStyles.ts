import { StyleSheet } from "react-native";
import { Colors } from "./globalStyles";

export const testsStyles = StyleSheet.create({
  title: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8, // Reduzi para acomodar a descrição abaixo
    letterSpacing: -0.5,
  },
  // ADICIONADO: Estilo para a descrição do painel
  description: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  testGrid: {
    width: "100%",
    gap: 14,
    alignItems: "stretch",
  },
  btnSuccess: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    elevation: 4,
  },
  btnError: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    elevation: 4,
  },
  btnAudio: {
    backgroundColor: "#6366F1",
    shadowColor: "#6366F1",
    elevation: 4,
  },
  btnFlashActive: {
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
    elevation: 6,
  },
});
