import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const themeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Slate 50 (Branco suave)
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  glow: {
    position: "absolute",
    top: -150,
    right: -100,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#bae6fd", // Sky 200
    borderRadius: width,
    opacity: 0.4,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 32,
    // Sombras muito mais suaves e orgânicas
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9", // Slate 100
  },
  badge: {
    backgroundColor: "#DCFCE7", // Emerald 100
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 20,
  },
  badgeText: {
    color: "#166534", // Emerald 800
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: "#0F172A", // Slate 900
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  highlight: {
    color: "#0284c7", // Sky 600
  },
  description: {
    color: "#64748b", // Slate 500
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#0F172A", // Botão escuro para contraste no tema light
    width: "100%",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: "#F1F5F9",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowOpacity: 0, // Remove sombra do secundário
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonTextSecondary: {
    color: "#475569", // Texto Slate 600
  },
  footer: {
    marginTop: 32,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  testGrid: {
    width: "100%",
    gap: 12,
  },
});
