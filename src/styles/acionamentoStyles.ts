import { StyleSheet } from "react-native";

/* =========================
   CONSTANTES EXPORTADAS
========================= */

export const BUTTON_SIZE = 64;
export const HORIZONTAL_PADDING = 24;
export const TRACK_PADDING = 8;

/* =========================
   ESTILOS
========================= */

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: HORIZONTAL_PADDING,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    marginBottom: 32,
    textAlign: "center",
  },

  slideTrack: {
    width: "100%",
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    padding: TRACK_PADDING,
    borderWidth: 2,
    overflow: "hidden",
  },

  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 40,
  },

  slideText: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  slideButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  cancelButton: {
    marginTop: 40,
    borderWidth: 1,
  },
});
