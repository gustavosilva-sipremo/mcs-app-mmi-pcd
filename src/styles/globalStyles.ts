import { Dimensions, Platform, StyleSheet } from "react-native";

export const { width, height } = Dimensions.get("window");

export const Colors = {
  primary: "#0F172A",
  secondary: "#475569",
  accent: "#0284C7",
  background: "#F8FAFC",
  card: "#FFFFFF",
  border: "#CBD5E1",
  glow: "#BAE6FD",

  danger: "#B91C1C",
  success: "#065F46",
  warning: "#92400E",

  muted: "#F1F5F9",
  textMuted: "#334155",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // ADICIONADO: Estilo Glow para o fundo dos cards
  glow: {
    position: "absolute",
    top: -width * 0.4, // Posiciona metade para fora
    right: -width * 0.2,
    width: width,
    height: width,
    backgroundColor: Colors.glow,
    borderRadius: width / 2,
    opacity: 0.4,
    // Efeito de desfoque (Blur) nativo
    ...Platform.select({
      ios: {
        shadowColor: Colors.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 60,
      },
      android: {
        elevation: 0, // Android não suporta shadowRadius alto, opacidade basta
      },
    }),
  },
  titleLarge: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: -1,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: { elevation: 4 },
    }),
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 68,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  buttonTextSecondary: {
    color: Colors.primary,
    fontWeight: "700",
  },
  highlight: {
    color: Colors.accent,
    fontWeight: "900",
  },
});
