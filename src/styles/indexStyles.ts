// styles/index.styles.ts
import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  /* =========================
     LAYOUT
  ========================== */

  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 6,
  },
  buttonGap: {
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
  logo: {
    alignSelf: "center",
    marginVertical: 6,
  },
  footerContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  /* =========================
     BADGE
  ========================== */

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginBottom: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  /* =========================
     TYPOGRAPHY
  ========================== */

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1.2,
    lineHeight: 40,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 32,
    paddingHorizontal: 12,
  },

  footerText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
});
