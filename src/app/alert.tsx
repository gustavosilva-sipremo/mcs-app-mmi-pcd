import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { EmergencyProtocolModal } from "@/components/alert/EmergencyProtocolModal";
import { Button } from "@/components/ui/Button";
import { useAlertPayload } from "@/context/AlertPayloadContext";
import { useAudio } from "@/context/AudioProvider";
import {
  buildEmergencySpeechText,
  defaultEmergencyAlert,
  emergencyCopy,
} from "@/features/alerts/content";
import { useTheme } from "@/context/ThemeContext";
import { useTorch } from "@/context/TorchProvider";
import { styles } from "@/styles/alertStyles";

export default function AlertScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { pendingAlert, clearPendingAlert } = useAlertPayload();
  const { set: setTorch } = useTorch();
  const { toggleAlertSound, stopAlertSound, speakMessage, stopTTS } = useAudio();

  const alertData = pendingAlert ?? defaultEmergencyAlert;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flashState, setFlashState] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const alertInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const overlayLoop = useRef<Animated.CompositeAnimation | null>(null);

  /* ==============================
     FALAR ALERTA
  ============================== */
  const speakAlert = useCallback(
    (data: typeof defaultEmergencyAlert) => {
      if (isSpeaking) return;
      setIsSpeaking(true);

      speakMessage(buildEmergencySpeechText(data));
      setIsSpeaking(false);
    },
    [isSpeaking, speakMessage]
  );

  useEffect(() => {
    return () => {
      clearPendingAlert();
    };
  }, [clearPendingAlert]);

  /* ==============================
     PARAR ALERTA COMPLETO
  ============================== */
  const stopHardwareActions = useCallback(() => {
    if (alertInterval.current) {
      clearInterval(alertInterval.current);
      alertInterval.current = null;
    }

    pulseLoop.current?.stop();
    overlayLoop.current?.stop();

    setFlashState(false);
    setTorch(false);

    void stopAlertSound();
  }, [setTorch, stopAlertSound]);

  /* ==============================
     INICIAR ALERTA AUTOMATICAMENTE
  ============================== */
  useEffect(() => {
    toggleAlertSound(true); // inicia o som de alerta

    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setFlashState(prev => {
        const next = !prev;
        setTorch(next);
        return next;
      });
    }, 400);

    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    overlayLoop.current = Animated.loop(
      Animated.timing(overlayAnim, { toValue: 1, duration: 2500, useNativeDriver: true })
    );
    overlayLoop.current.start();

    return () => {
      stopHardwareActions();
    };
  }, [pulseAnim, overlayAnim, setTorch, stopHardwareActions, toggleAlertSound]);

  /* ==============================
     ABRIR PROTOCOLO
  ============================== */
  const handleOpenProtocol = () => {
    stopHardwareActions(); // para flash e som do alerta
    stopTTS();             // ✅ para qualquer TTS ativo

    setIsModalVisible(true);

    speakAlert(alertData);
  };

  const backgroundColor = flashState ? theme.danger : theme.background;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.scanline,
          {
            backgroundColor: theme.text + "20",
            transform: [
              { translateY: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [-200, 1000] }) },
            ],
          },
        ]}
      />

      <Animated.View style={[styles.alertContent, { transform: [{ scale: pulseAnim }] }]}>
        <Ionicons name="warning" size={120} color={theme.text} />

        <Text
          accessibilityRole="header"
          style={[styles.alertSubtitle, { color: theme.text }]}
        >
          {emergencyCopy.ptBR.alertScreen.subtitle}
        </Text>
        <Text
          accessibilityRole="header"
          style={[styles.alertTitle, { color: theme.text }]}
        >
          {emergencyCopy.ptBR.alertScreen.title}
        </Text>

        <View style={[styles.dangerBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text
            style={[styles.dangerText, { color: theme.primary }]}
            numberOfLines={2}
            accessibilityRole="text"
          >
            {alertData.title}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <Button
          title={emergencyCopy.ptBR.alertScreen.openProtocolButton}
          icon="shield-checkmark"
          onPress={handleOpenProtocol}
          variantStyle={[styles.primaryButton, { backgroundColor: theme.primary }]}
          textStyle={[styles.primaryButtonText, { color: theme.background }]}
        />
      </View>

      <EmergencyProtocolModal
        visible={isModalVisible}
        alertData={alertData}
        onClose={() => {
          setIsModalVisible(false);
          clearPendingAlert();
          router.replace("/");
        }}
        onAcknowledge={() => {
          setIsModalVisible(false);
          clearPendingAlert();
          router.replace("/");
        }}
      />
    </View>
  );
}