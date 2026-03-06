import { StyleSheet } from "react-native";

export const createStyles = (theme: any, severityColor: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: "#000000CC",
    },

    container: {
      backgroundColor: theme.card,
      borderWidth: 3,
      borderColor: severityColor,
      borderRadius: 18,
      padding: 22,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    headerTextContainer: {
      marginLeft: 12,
      flex: 1,
    },

    title: {
      fontSize: 20,
      fontWeight: "900",
    },

    subtitle: {
      fontSize: 14,
      fontWeight: "700",
      marginTop: 4,
    },

    badge: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
      alignSelf: "flex-start",
      marginBottom: 18,
    },

    badgeText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 13,
      letterSpacing: 1,
    },

    messageScroll: {
      maxHeight: 300,
    },

    messageText: {
      fontSize: 17,
      lineHeight: 26,
      fontWeight: "500",
    },

    buttons: {
      marginTop: 26,
    },

    spacer: {
      height: 14,
    },
  });
