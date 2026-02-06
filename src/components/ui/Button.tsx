import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics"; // Adicionado para feedback tátil em todos os botões
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
  hapticType?: Haptics.ImpactFeedbackStyle; // Permite personalizar a vibração do clique
}

export const Button = ({
  title,
  icon,
  variantStyle,
  textStyle,
  hapticType = Haptics.ImpactFeedbackStyle.Light,
  onPress,
  ...props
}: ButtonProps) => {
  const flatTextStyle = StyleSheet.flatten(textStyle);
  const iconColor = flatTextStyle?.color || "#FFFFFF";

  const handlePress = (event: any) => {
    // PCD: Feedback tátil em cada interação confirma para o usuário que o botão foi acionado
    Haptics.impactAsync(hapticType);
    if (onPress) onPress(event);
  };

  return (
    <TouchableOpacity
      style={[g.button, styles.base, variantStyle]}
      activeOpacity={0.8}
      onPress={handlePress}
      // ACESSIBILIDADE (PCD):
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel || `Botão: ${title}`}
      accessibilityHint={
        props.accessibilityHint || "Toque duas vezes para ativar"
      }
      {...props}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={iconColor as string}
            importantForAccessibility="no-hide-descendants" // Ícone é decorativo, o texto já explica
          />
        )}
        <Text style={[g.buttonText, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: "100%",
    minHeight: 64, // Mínimo de 48dp é o exigido pelo Google, 64 é ideal para luvas/trabalho
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
