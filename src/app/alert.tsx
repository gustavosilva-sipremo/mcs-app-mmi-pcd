import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { EmergencyProtocolModal } from "@/components/alert/EmergencyProtocolModal";
import { Button } from "@/components/ui/Button";
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
  const { set: setTorch } = useTorch();
  const { toggleAlertSound, speakMessage, stopTTS } = useAudio(); // ✅ pega stopTTS real

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
    (alertData: typeof defaultEmergencyAlert) => {
      if (isSpeaking) return;
      setIsSpeaking(true);

      speakMessage(buildEmergencySpeechText(alertData));
      setIsSpeaking(false);
    },
    [isSpeaking, speakMessage]
  );

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

    toggleAlertSound(false); // interrompe o som do alerta
  }, [setTorch, toggleAlertSound]);

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

    // TTS opcional para o modal
    speakAlert(defaultEmergencyAlert);
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
          <Text style={[styles.dangerText, { color: theme.primary }]}>
            {emergencyCopy.ptBR.alertScreen.badge}
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
        alertData={defaultEmergencyAlert}
        onClose={() => {
          setIsModalVisible(false);
          router.replace("/");
        }}
        onAcknowledge={() => {
          setIsModalVisible(false);
          router.replace("/");
        }}
      />
    </View>
  );
}