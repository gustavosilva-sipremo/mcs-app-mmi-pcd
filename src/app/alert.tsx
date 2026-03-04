import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

export default function AlertScreen() {
  const router = useRouter();
  const { theme, isHighContrast } = useTheme();

  const [permission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flash, setFlash] = useState(false);

  const player = useAudioPlayer(require("@/assets/sounds/metal_gear.mp3"));

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const alertInterval = useRef<any>(null);

  /* =========================
     HARDWARE STOP
  ========================== */
  const stopHardwareActions = () => {
    if (alertInterval.current) {
      clearInterval(alertInterval.current);
      alertInterval.current = null;
    }

    Speech.stop();

    try {
      player?.pause();
    } catch { }
    setFlash(false);
  };

  /* =========================
     EFFECTS INIT
  ========================== */
  useEffect(() => {
    player.loop = true;
    player.play();

    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      setFlash((prev) => !prev);
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
      ]),
    ).start();

    Animated.loop(
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
    ).start();

    return stopHardwareActions;
  }, []);

  /* =========================
     PROTOCOL OPEN
  ========================== */
  const handleOpenProtocol = () => {
    stopHardwareActions();
    setIsModalVisible(true);

    Speech.speak(
      "Atenção. Protocolo de evacuação ativado. Dirija-se imediatamente ao ponto de encontro.",
      { language: "pt-BR", rate: 0.9 }
    );
  };

  /* =========================
     RENDER
  ========================== */

  const backgroundColor = flash
    ? theme.danger
    : theme.background;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* SCANLINE */}
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

      {/* ALERT CONTENT */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Ionicons
          name="warning"
          size={120}
          color={theme.text}
        />

        <Text
          style={[
            styles.alertSubtitle,
            { color: theme.text },
          ]}
        >
          PROTOCOLO CRÍTICO
        </Text>

        <Text
          style={[
            styles.alertTitle,
            { color: theme.text },
          ]}
        >
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

      {/* BOTÃO PRINCIPAL */}
      <View style={styles.bottomContainer}>
        <Button
          title="ABRIR PROTOCOLO"
          icon="shield-checkmark"
          onPress={handleOpenProtocol}
          variantStyle={{
            backgroundColor: theme.primary,
            height: 75,
            borderRadius: 16,
          }}
          textStyle={{
            color: theme.background,
            fontWeight: "900",
            fontSize: 18,
          }}
        />
      </View>

      {/* MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.background + "F2" },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Ionicons
                name="business"
                size={28}
                color={theme.primary}
              />
              <Text
                style={[
                  styles.modalTitle,
                  { color: theme.text },
                ]}
              >
                MMI MINERADORA
              </Text>
            </View>

            <Text
              style={[
                styles.modalSub,
                { color: theme.text },
              ]}
            >
              Instruções de Emergência
            </Text>

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {[
              { label: "Local", val: "Setor Norte" },
              { label: "Motivo", val: "Instabilidade" },
              { label: "Rota", val: "Ponto B" },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.infoItem,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.text },
                  ]}
                >
                  <Text style={{ fontWeight: "900" }}>
                    {item.label}:
                  </Text>{" "}
                  {item.val}
                </Text>
              </View>
            ))}

            <Button
              title="OUVIR NOVAMENTE"
              icon="volume-high"
              variantStyle={{
                marginTop: 20,
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{ color: theme.text }}
              onPress={() =>
                Speech.speak(
                  "Repetindo instruções de evacuação.",
                  { language: "pt-BR" }
                )
              }
            />

            <Button
              title="ENCERRAR ALERTA"
              icon="log-out"
              variantStyle={{
                marginTop: 12,
                backgroundColor: theme.danger,
              }}
              textStyle={{
                color: theme.background,
                fontWeight: "700",
              }}
              onPress={() => {
                setIsModalVisible(false);
                router.replace("/");
              }}
            />
          </View>
        </View>
      </Modal>

      {permission?.granted && (
        <CameraView
          style={styles.hiddenCamera}
          enableTorch={flash}
          facing="back"
        />
      )}
    </View>
  );
}

/* =========================
   ESTILOS BASE
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanline: {
    position: "absolute",
    width: "100%",
    height: 120,
    zIndex: 5,
  },
  alertSubtitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 20,
  },
  alertTitle: {
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
  },
  dangerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    borderRadius: 6,
    borderWidth: 2,
  },
  dangerText: {
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 32,
    zIndex: 11,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  modalSub: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 2,
    marginVertical: 20,
  },
  infoItem: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});