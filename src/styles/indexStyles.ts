import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 20,
  },
  badgeText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  footer: {
    marginTop: 32,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
});
