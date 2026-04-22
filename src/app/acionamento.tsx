import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  AccessibilityActionEvent,
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { emergencyCopy } from "@/features/alerts/content";
import { useTheme } from "@/context/ThemeContext";

import {
  BUTTON_SIZE,
  HORIZONTAL_PADDING,
  styles,
  TRACK_PADDING,
} from "@/styles/acionamentoStyles";

/* =========================
   CONSTANTES DINÂMICAS
========================= */

const { width } = Dimensions.get("window");

const SLIDE_WIDTH = width - HORIZONTAL_PADDING * 2;
const DISTANCE = SLIDE_WIDTH - BUTTON_SIZE - TRACK_PADDING * 2;
const SUCCESS_THRESHOLD = DISTANCE * 0.85;

/* =========================
   COMPONENTE
========================= */

export default function AcionamentoScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const copy = emergencyCopy.ptBR.acionamento;

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

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      const actionName = event.nativeEvent.actionName;
      if (actionName === "activate" || actionName === "increment") {
        handleSuccess();
      }
    },
    [handleSuccess]
  );

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
            accessibilityRole="header"
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            {copy.titlePrefix}{" "}
            <Text style={{ color: theme.danger }}>
              {copy.titleHighlight}
            </Text>
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.text },
            ]}
          >
            {copy.description}
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
            accessibilityLabel={copy.sliderLabel}
            accessibilityHint={copy.sliderHint}
            accessibilityActions={[
              {
                name: "activate",
                label: copy.accessibilityConfirmLabel,
              },
              {
                name: "increment",
                label: copy.accessibilityConfirmLabel,
              },
            ]}
            onAccessibilityAction={handleAccessibilityAction}
          >
            <Animated.View
              style={[
                styles.fill,
                {
                  width: fillWidth,
                  backgroundColor: theme.danger + "20",
                },
              ]}
            />

            <Animated.Text
              style={[
                styles.slideText,
                {
                  opacity: textOpacity,
                  color: theme.text,
                },
              ]}
            >
              {copy.sliderText}
            </Animated.Text>

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
            title={copy.cancelButton}
            variantStyle={[
              styles.cancelButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            textStyle={{ color: theme.text }}
            onPress={() => router.back()}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}