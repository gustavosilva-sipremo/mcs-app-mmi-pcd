import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { EmergencyProtocolModal } from "@/components/alert/EmergencyProtocolModal";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTorch } from "@/context/TorchProvider";
import { hardwareService } from "@/services/HardwareService";
import { styles } from "@/styles/alertStyles";

export default function AlertScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { set: setTorch } = useTorch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flashState, setFlashState] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const player = useAudioPlayer(
    require("@/assets/sounds/metal_gear.mp3")
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const alertInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const overlayLoop = useRef<Animated.CompositeAnimation | null>(null);

  /* ==============================
     CONTROLE DE VOZ
  ============================== */

  const speakAlert = useCallback(
    (alertData: {
      level: string;
      structure: string;
      title: string;
      message: string;
    }) => {
      if (isSpeaking) return;

      setIsSpeaking(true);

      Speech.stop();

      const fullMessage = `
${alertData.level}.
Estrutura ${alertData.structure}.
${alertData.title}.
${alertData.message}
`;

      Speech.speak(fullMessage, {
        language: "pt-BR",
        rate: 0.85,
        pitch: 1,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [isSpeaking]
  );

  /* ==============================
     PARAR TUDO
  ============================== */

  const stopHardwareActions = useCallback(() => {
    if (alertInterval.current) {
      clearInterval(alertInterval.current);
      alertInterval.current = null;
    }

    pulseLoop.current?.stop();
    overlayLoop.current?.stop();

    Speech.stop();

    try {
      hardwareService.stopAlertSound();
    } catch { }

    setFlashState(false);
    setTorch(false);
  }, [setTorch]);

  /* ==============================
     INICIAR ALERTA
  ============================== */

  useEffect(() => {
    hardwareService.registerAlertPlayer(player);
    hardwareService.playAlertSound(true);

    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );

      setFlashState(prev => {
        const next = !prev;
        setTorch(next);
        return next;
      });
    }, 400);

    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.current.start();

    overlayLoop.current = Animated.loop(
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );

    overlayLoop.current.start();

    return stopHardwareActions;
  }, [player, pulseAnim, overlayAnim, setTorch, stopHardwareActions]);

  /* ==============================
     ABRIR PROTOCOLO
  ============================== */

  const handleOpenProtocol = () => {
    stopHardwareActions();
    setIsModalVisible(true);

    const alertPayload = {
      level: "Nível 3",
      structure: "B1 Ipê",
      title: "Ruptura da Barragem",
      message: `Alerta de Emergência Nível 3.
Ruptura da barragem B1 Ipê Mina. Iminente ou ocorrendo.
Dar início às Ações de Emergência em Nível 3.
Providenciar os recursos necessários para atendimento.`,
    };

    speakAlert(alertPayload);
  };

  const backgroundColor = flashState
    ? theme.danger
    : theme.background;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.scanline,
          {
            backgroundColor: theme.text + "20",
            transform: [
              {
                translateY: overlayAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 1000],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.alertContent,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Ionicons
          name="warning"
          size={120}
          color={theme.text}
        />

        <Text style={[styles.alertSubtitle, { color: theme.text }]}>
          PROTOCOLO CRÍTICO
        </Text>

        <Text style={[styles.alertTitle, { color: theme.text }]}>
          EVACUAÇÃO
        </Text>

        <View
          style={[
            styles.dangerBadge,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.dangerText,
              { color: theme.primary },
            ]}
          >
            ALERTA ATIVO
          </Text>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <Button
          title="ABRIR PROTOCOLO"
          icon="shield-checkmark"
          onPress={handleOpenProtocol}
          variantStyle={[
            styles.primaryButton,
            { backgroundColor: theme.primary },
          ]}
          textStyle={[
            styles.primaryButtonText,
            { color: theme.background },
          ]}
        />
      </View>

      <EmergencyProtocolModal
        visible={isModalVisible}
        alertData={{
          level: "Nível 3",
          structure: "B1 Ipê",
          title: "Ruptura da Barragem",
          message: `Alerta de Emergência Nível 3.
Ruptura da barragem B1 Ipê Mina. Iminente ou ocorrendo.
Dar início às Ações de Emergência em Nível 3.
Providenciar os recursos necessários para atendimento.`,
        }}
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