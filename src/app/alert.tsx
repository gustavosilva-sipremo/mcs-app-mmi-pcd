import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { EmergencyProtocolModal } from "@/components/alert/EmergencyProtocolModal";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTorch } from "@/context/TorchProvider";
import { styles } from "@/styles/alertStyles";

export default function AlertScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { set: setTorch } = useTorch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flashState, setFlashState] = useState(false);

  const player = useAudioPlayer(
    require("@/assets/sounds/metal_gear.mp3")
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const alertInterval = useRef<any>(null);

  const stopHardwareActions = () => {
    if (alertInterval.current) {
      clearInterval(alertInterval.current);
      alertInterval.current = null;
    }

    Speech.stop();

    try {
      player?.pause();
    } catch { }

    setFlashState(false);
    setTorch(false);
  };

  useEffect(() => {
    player.loop = true;
    player.play();

    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );

      setFlashState((prev) => {
        const next = !prev;
        setTorch(next);
        return next;
      });
    }, 400);

    Animated.loop(
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
    ).start();

    Animated.loop(
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    ).start();

    return stopHardwareActions;
  }, []);

  const handleOpenProtocol = () => {
    stopHardwareActions();
    setIsModalVisible(true);

    Speech.speak(
      "Atenção. Protocolo de evacuação ativado. Dirija-se imediatamente ao ponto de encontro.",
      { language: "pt-BR", rate: 0.9 }
    );
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
        onRepeat={() =>
          Speech.speak(
            "Repetindo instruções de evacuação.",
            { language: "pt-BR" }
          )
        }
        onClose={() => {
          stopHardwareActions();
          setIsModalVisible(false);
          router.replace("/");
        }}
      />
    </View>
  );
}