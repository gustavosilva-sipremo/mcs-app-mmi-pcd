import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { indexStyles as s } from "../../styles/indexStyles";

interface BadgeProps {
  title: string;
  variant?: "success" | "warning" | "error" | "info";
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({
  title,
  variant = "info",
  containerStyle,
  textStyle,
}: BadgeProps) => {
  // Mapeamento de cores baseado na semântica de alertas
  const variantStyles = StyleSheet.create({
    success: { backgroundColor: "#DCFCE7", color: "#166534" },
    warning: { backgroundColor: "#FEF3C7", color: "#92400E" },
    error: { backgroundColor: "#FEE2E2", color: "#991B1B" },
    info: { backgroundColor: "#E0F2FE", color: "#075985" },
  });

  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        s.badge,
        { backgroundColor: currentVariant.backgroundColor },
        containerStyle,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${title}`}
    >
      <Text style={[s.badgeText, { color: currentVariant.color }, textStyle]}>
        {title}
      </Text>
    </View>
  );
};
