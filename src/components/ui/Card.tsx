import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { globalStyles as g } from "../../styles/globalStyles";

interface CardProps {
  children: React.ReactNode;
  animate?: boolean;
  style?: ViewStyle; // Permite sobrescrever margens ou paddings
}

export const Card = ({ children, animate = false, style }: CardProps) => {
  // Criamos dois valores para uma animação mais fluida (opacidade + movimento)
  const fadeAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(animate ? 20 : 0)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate]);

  return (
    <View style={styles.wrapper}>
      {/* O Glow fica aqui para não interferir no padding interno do Card */}
      <View style={g.glow} />

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
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  baseCard: {
    width: "100%", // Garante que o Card expanda até o limite do padding do pai
    overflow: "hidden", // Mantém os cantos arredondados bonitos
  },
});
