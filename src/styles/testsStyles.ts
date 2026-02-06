import { StyleSheet } from "react-native";
import { Colors } from "./globalStyles";

export const testsStyles = StyleSheet.create({
  title: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  testGrid: {
    width: "100%",
    gap: 14, // Aumentado levemente para melhorar a área de clique
    alignItems: "stretch",
  },

  // Variantes Semânticas com Sombras Coloridas
  btnSuccess: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    elevation: 4, // Para Android
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
    elevation: 6, // Maior destaque quando o flash está ligado
  },
});
