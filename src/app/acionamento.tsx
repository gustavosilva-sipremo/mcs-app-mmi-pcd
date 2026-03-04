import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { useTheme } from "../context/ThemeContext";

/* =========================
   CONSTANTES
========================= */

const { width } = Dimensions.get("window");

const BUTTON_SIZE = 64;
const HORIZONTAL_PADDING = 24;
const TRACK_PADDING = 8;

const SLIDE_WIDTH = width - HORIZONTAL_PADDING * 2;
const DISTANCE = SLIDE_WIDTH - BUTTON_SIZE - TRACK_PADDING * 2;
const SUCCESS_THRESHOLD = DISTANCE * 0.85;

/* =========================
   COMPONENTE
========================= */

export default function AcionamentoScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const translateX = useRef(new Animated.Value(0)).current;
  const [locked, setLocked] = useState(false);

  /* =========================
     RESET
  ========================== */
  const resetSlider = useCallback(() => {
    translateX.setValue(0);
    setLocked(false);
  }, [translateX]);

  /* =========================
     SUCESSO
  ========================== */
  const handleSuccess = useCallback(async () => {
    if (locked) return;

    setLocked(true);

    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    Animated.timing(translateX, {
      toValue: DISTANCE,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      router.push("/alert");
      setTimeout(resetSlider, 500);
    });
  }, [locked, router, translateX, resetSlider]);

  /* =========================
     FALHA
  ========================== */
  const handleFail = useCallback(async () => {
    if (locked) return;

    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );

    Animated.spring(translateX, {
      toValue: 0,
      friction: 6,
      tension: 90,
      useNativeDriver: false,
    }).start();
  }, [locked, translateX]);

  /* =========================
     PAN RESPONDER
  ========================== */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 5,

        onPanResponderMove: (_, gesture) => {
          if (locked) return;

          const clamped = Math.max(
            0,
            Math.min(gesture.dx, DISTANCE)
          );

          translateX.setValue(clamped);
        },

        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx >= SUCCESS_THRESHOLD) {
            handleSuccess();
          } else {
            handleFail();
          }
        },
      }),
    [handleSuccess, handleFail, locked, translateX]
  );

  /* =========================
     PROGRESSO VISUAL
  ========================== */

  const progress = Animated.divide(translateX, DISTANCE);

  const textOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.2],
    extrapolate: "clamp",
  });

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DISTANCE + BUTTON_SIZE],
    extrapolate: "clamp",
  });

  /* =========================
     RENDER
  ========================== */

  return (
    <ScreenContainer
      style={{ backgroundColor: theme.background }}
    >
      <View style={styles.container}>
        <Card
          animate
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            Confirmação de{" "}
            <Text style={{ color: theme.danger }}>
              Alerta
            </Text>
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.text },
            ]}
          >
            Deslize o botão para ativar o protocolo de evacuação imediata.
          </Text>

          <View
            style={[
              styles.slideTrack,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Deslizar para disparar alerta"
            accessibilityHint="Deslize totalmente para a direita para confirmar"
          >
            {/* FILL PROGRESSIVO */}
            <Animated.View
              style={[
                styles.fill,
                {
                  width: fillWidth,
                  backgroundColor: theme.danger + "20",
                },
              ]}
            />

            {/* TEXTO */}
            <Animated.Text
              style={[
                styles.slideText,
                {
                  opacity: textOpacity,
                  color: theme.text,
                },
              ]}
            >
              DESLIZE PARA DISPARAR
            </Animated.Text>

            {/* BOTÃO */}
            <Animated.View
              style={[
                styles.slideButton,
                {
                  backgroundColor: theme.primary,
                  transform: [{ translateX }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Ionicons
                name="chevron-forward"
                size={28}
                color="#000"
              />
            </Animated.View>
          </View>

          <Button
            title="Cancelar & Voltar"
            variantStyle={{
              marginTop: 40,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
            }}
            textStyle={{ color: theme.text }}
            onPress={() => router.back()}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}

/* =========================
   ESTILOS
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: HORIZONTAL_PADDING,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    marginBottom: 32,
    textAlign: "center",
  },

  slideTrack: {
    width: "100%",
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    padding: TRACK_PADDING,
    borderWidth: 2,
    overflow: "hidden",
  },

  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 40,
  },

  slideText: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  slideButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});