import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type BadgeVariant = "success" | "warning" | "error" | "info";

interface BadgeProps {
  title: string;
  variant?: BadgeVariant;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
}

export const Badge = ({
  title,
  variant = "info",
  containerStyle,
  textStyle,
  accessibilityLabel,
  icon,
  outlined = false,
}: BadgeProps) => {
  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        styles.container,
        outlined
          ? {
            borderColor: currentVariant.color,
            borderWidth: 1.5,
            backgroundColor: "transparent",
          }
          : {
            backgroundColor: currentVariant.backgroundColor,
          },
        containerStyle,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabel || `Status ${variant}: ${title}`
      }
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={outlined ? currentVariant.color : currentVariant.color}
          style={styles.icon}
          importantForAccessibility="no-hide-descendants"
        />
      )}

      <Text
        style={[
          styles.text,
          { color: currentVariant.color },
          textStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999, // pill real
    minHeight: 28,
  },

  text: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  icon: {
    marginRight: 6,
  },
});

const variantStyles = {
  success: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  warning: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  info: {
    backgroundColor: "#E0F2FE",
    color: "#075985",
  },
};