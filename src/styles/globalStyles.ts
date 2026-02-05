import { Dimensions, StyleSheet } from "react-native";

export const { width, height } = Dimensions.get("window");

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    backgroundColor: "#bae6fd",
    borderRadius: width,
    opacity: 0.4,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 32,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  button: {
    backgroundColor: "#0F172A",
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  highlight: {
    color: "#0284c7",
  },
});
