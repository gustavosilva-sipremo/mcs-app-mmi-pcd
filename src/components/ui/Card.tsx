import React, { memo, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { globalStyles as g } from "../../styles/globalStyles";

interface CardProps {
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
  style?: ViewStyle;
  accessible?: boolean;
}

export const Card = memo(
  ({
    children,
    animate = false,
    delay = 0,
    style,
    accessible = true,
  }: CardProps) => {
    const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
    const translateY = useRef(new Animated.Value(animate ? 24 : 0)).current;
    const scale = useRef(new Animated.Value(animate ? 0.98 : 1)).current;

    useEffect(() => {
      if (!animate) return;

      const animation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]);

      animation.start();

      return () => animation.stop();
    }, [animate, delay]);

    return (
      <View style={styles.wrapper}>
        {/* Glow decorativo (não lido por leitor de tela) */}
        <View
          style={g.glow}
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
        />

        <Animated.View
          accessible={accessible}
          accessibilityRole="summary"
          style={[
            g.card,
            styles.baseCard,
            {
              opacity,
              transform: [{ translateY }, { scale }],
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  baseCard: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
});