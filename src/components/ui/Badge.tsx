import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { indexStyles as s } from "../../styles/indexStyles";

// Definimos as variantes permitidas
type BadgeVariant = "success" | "warning" | "error" | "info";

interface BadgeProps {
  title: string;
  variant?: BadgeVariant;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string; // Propriedade para leitores de tela (PCD)
}

export const Badge = ({
  title,
  variant = "info",
  containerStyle,
  textStyle,
  accessibilityLabel,
}: BadgeProps) => {
  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        s.badge,
        { backgroundColor: currentVariant.backgroundColor },
        containerStyle,
      ]}
      accessible={true}
      accessibilityRole="text"
      // Se não enviarmos um label específico, ele lê o título padrão
      accessibilityLabel={accessibilityLabel || `Status: ${title}`}
    >
      <Text
        style={[
          s.badgeText,
          { color: currentVariant.color },
          textStyle,
          { fontWeight: "800" }, // Aumento de peso para legibilidade (PCD)
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

// Estilos movidos para fora do componente para melhor performance
const variantStyles = {
  success: { backgroundColor: "#DCFCE7", color: "#166534" },
  warning: { backgroundColor: "#FEF3C7", color: "#92400E" },
  error: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  info: { backgroundColor: "#E0F2FE", color: "#075985" },
};
