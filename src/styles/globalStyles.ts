import { Dimensions, Platform, StyleSheet } from "react-native";

export const { width, height } = Dimensions.get("window");

// Design Tokens - Facilita mudar o tema do app todo de uma vez
export const Colors = {
  primary: "#0F172A", // Slate 900
  secondary: "#64748B", // Slate 500
  accent: "#0284c7", // Sky 600
  background: "#F8FAFC", // Slate 50
  card: "#FFFFFF",
  border: "#F1F5F9",
  glow: "#bae6fd",

  // Cores de suporte (usadas nos botões secundários)
  muted: "#F1F5F9",
  textMuted: "#475569",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  // Efeito visual de fundo
  glow: {
    position: "absolute",
    top: -width * 0.4,
    right: -width * 0.2,
    width: width,
    height: width,
    backgroundColor: Colors.glow,
    borderRadius: width / 2,
    opacity: 0.5,
    // Blur no Android é limitado, mas no iOS fica perfeito
    ...(Platform.OS === "ios"
      ? { shadowColor: Colors.glow, shadowRadius: 50, shadowOpacity: 1 }
      : {}),
  },
  card: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    // Sombras suaves
    ...Platform.select({
      ios: {
        shadowColor: "#64748b",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  // Botão Principal (Primário)
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 60,
    borderRadius: 18,
    flexDirection: "row", // Preparado para ícones
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // VARIANTES GLOBAIS - Resolve o erro de TS
  buttonSecondary: {
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonTextSecondary: {
    color: Colors.textMuted,
  },
  highlight: {
    color: Colors.accent,
    fontWeight: "800",
  },
});
