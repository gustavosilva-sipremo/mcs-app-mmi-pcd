import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { globalStyles as g } from "../../styles/globalStyles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variantStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export const Button = ({
  title,
  icon,
  variantStyle,
  textStyle,
  ...props
}: ButtonProps) => {
  // Extrai a cor do texto para aplicar ao ícone automaticamente
  const flatTextStyle = StyleSheet.flatten(textStyle);
  const iconColor = flatTextStyle?.color || "#FFFFFF";

  return (
    <TouchableOpacity
      // Unimos o estilo global com os específicos, garantindo que width: '100%' prevaleça
      style={[g.button, styles.base, variantStyle]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel || title}
      {...props}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={22} // Aumentado levemente para melhor visibilidade
            color={iconColor as string}
          />
        )}
        <Text style={[g.buttonText, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: "100%", // Força a ocupação total do container pai (Card)
    minHeight: 60, // Garante uma área de toque confortável (PCD)
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10, // Espaçamento consistente entre ícone e texto
    paddingHorizontal: 16,
  },
});
