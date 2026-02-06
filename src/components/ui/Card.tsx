import React, { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { globalStyles as g } from "../../styles/globalStyles";

interface CardProps {
  children: React.ReactNode;
  animate?: boolean;
  style?: ViewStyle;
}

// React.memo evita que o Card renderize novamente se os dados do pai (bateria, etc)
// mudarem, mas o conteúdo interno for estático.
export const Card = memo(({ children, animate = false, style }: CardProps) => {
  const fadeAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(animate ? 30 : 0)).current;

  useEffect(() => {
    if (animate) {
      // Usamos sequence ou parallel com Easing para um "feel" premium
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          // Spring em vez de timing para um efeito elástico leve
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate]);

  return (
    <View style={styles.wrapper}>
      {/* Glow decorativo: important-hide para leitores de tela */}
      <View
        style={g.glow}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      />

      <Animated.View
        style={[
          g.card,
          styles.baseCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Garante que o Card fique acima de glows de fundo
  },
  baseCard: {
    width: "100%",
    overflow: "hidden", // Crucial para garantir que elementos filhos não vazem o borderRadius
  },
});
