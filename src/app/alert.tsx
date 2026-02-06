import { Ionicons } from "@expo/vector-icons"; // Usando ícone vetorial
import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/ui/Button";

export default function AlertScreen() {
  const router = useRouter();
  const [permission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flash, setFlash] = useState(false);

  const player = useAudioPlayer(require("../assets/sounds/metal_gear.mp3"));
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const alertInterval = useRef<any>(null);

  const stopHardwareActions = () => {
    if (alertInterval.current) {
      clearInterval(alertInterval.current);
      alertInterval.current = null;
    }

    // Proteção contra o erro "Already Released"
    try {
      if (player && typeof player.pause === "function") {
        player.pause();
        player.seekTo(0);
      }
    } catch (e) {
      console.log("Audio release safe catch");
    }
    setFlash(false);
  };

  useEffect(() => {
    player.loop = true;
    player.play();

    // Loop de Hardware (Vibração Contínua + Flash)
    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFlash((prev) => !prev);
    }, 400);

    // Animação 1: Pulsar conteúdo central
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

    // Animação 2: Overlay de Scanline (Efeito visual gritante)
    Animated.loop(
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    return () => stopHardwareActions();
  }, []);

  const handleStopEmergency = () => {
    stopHardwareActions();
    setIsModalVisible(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: flash ? "#D92D20" : "#000" },
      ]}
    >
      {/* Camada de Interferência Visual */}
      <Animated.View
        style={[
          styles.scanline,
          {
            translateY: overlayAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-200, 1000],
            }),
          },
        ]}
      />

      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <View style={styles.alertIconContainer}>
          <Ionicons name="warning" size={100} color="#FFF" />
        </View>
        <Text style={styles.alertSubtitle}>PROTOCOLO DE CRÍTICO</Text>
        <Text style={styles.alertTitle}>EVACUAÇÃO</Text>
        <View style={styles.dangerBadge}>
          <Text style={styles.dangerText}>RISCO NÍVEL 03</Text>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <Button
          title="ABRIR PROTOCOLO"
          icon="shield-checkmark"
          onPress={handleStopEmergency}
          variantStyle={styles.mainButton}
          textStyle={{ color: "#000", fontWeight: "900" }}
        />
      </View>

      {/* Modal Reestilizado */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="business" size={24} color="#ef4444" />
              <Text style={styles.modalTitle}>MMI MINERADORA</Text>
            </View>

            <Text style={styles.modalSub}>Relatório de Incidente Gerado</Text>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              {[
                {
                  label: "Local",
                  val: "Setor de Britagem Norte",
                  icon: "location",
                },
                {
                  label: "Motivo",
                  val: "Instabilidade de Talude",
                  icon: "alert-circle",
                },
                { label: "Rota", val: "Ponto de Encontro B", icon: "walk" },
              ].map((item, i) => (
                <View key={i} style={styles.infoItem}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#ef4444"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.infoText}>
                    <Text style={styles.bold}>{item.label}:</Text> {item.val}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="ENCERRAR SIMULAÇÃO"
              icon="exit"
              variantStyle={{ marginTop: 24, backgroundColor: "#1e293b" }}
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
    height: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 5,
  },
  alertIconContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginBottom: 10,
  },
  alertSubtitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 4,
    opacity: 0.9,
  },
  alertTitle: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 55,
  },
  dangerBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  dangerText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 32,
    zIndex: 11,
  },
  mainButton: { backgroundColor: "#FFF", height: 70, borderRadius: 12 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 20, padding: 24 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "900", color: "#1e293b" },
  modalSub: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  divider: { height: 2, backgroundColor: "#f1f5f9", marginVertical: 15 },
  infoRow: { gap: 10 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 12,
  },
  infoText: { fontSize: 15, color: "#334155", flex: 1 },
  bold: { fontWeight: "800" },
  hiddenCamera: { position: "absolute", width: 1, height: 1, opacity: 0 },
});
