// styles/tests.styles.ts
import { StyleSheet } from "react-native";

export const testsStyles = StyleSheet.create({
  /* =========================
     LAYOUT
  ========================== */

  container: {
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  grid: {
    width: "100%",
    gap: 14,
    alignItems: "stretch",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  /* =========================
     TYPOGRAPHY
  ========================== */

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 20,
  },

  /* =========================
     BUTTON VARIANTS
  ========================== */

  btnSuccess: {
    backgroundColor: "#10B981",
    elevation: 4,
  },
  btnError: {
    backgroundColor: "#EF4444",
    elevation: 4,
  },
  btnFlashActive: {
    backgroundColor: "#F59E0B",
    elevation: 6,
  },
});
