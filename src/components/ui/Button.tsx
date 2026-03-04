import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variantStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  hapticType?: Haptics.ImpactFeedbackStyle;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  title,
  icon,
  variantStyle,
  textStyle,
  hapticType = Haptics.ImpactFeedbackStyle.Light,
  onPress,
  loading = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  ...props
}: ButtonProps) => {
  const flatTextStyle = StyleSheet.flatten(textStyle);
  const iconColor = flatTextStyle?.color || "#FFFFFF";

  const handlePress = async (event: any) => {
    if (disabled || loading) return;

    await Haptics.impactAsync(hapticType);

    if (onPress) onPress(event);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.container,
        disabled && styles.disabled,
        variantStyle,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={
        accessibilityHint || "Toque duas vezes para ativar"
      }
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor as string} />
      ) : (
        <>
          {/* ÍCONE FIXO */}
          <View style={styles.iconContainer}>
            {icon && (
              <Ionicons
                name={icon}
                size={22}
                color={iconColor as string}
                importantForAccessibility="no-hide-descendants"
              />
            )}
          </View>

          {/* TEXTO CENTRALIZADO REAL */}
          <View style={styles.textContainer}>
            <Text
              style={[styles.text, textStyle]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {title}
            </Text>
          </View>

          {/* Espaço fantasma para manter simetria */}
          <View style={styles.iconContainer} />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 64,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  disabled: {
    opacity: 0.6,
  },

  iconContainer: {
    width: 32, // largura fixa
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    alignItems: "center", // centraliza o texto independente do ícone
    justifyContent: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});