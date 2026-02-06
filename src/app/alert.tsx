import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech"; // Adicionado para PCD
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
    Speech.stop(); // Interrompe a fala se o usuário sair
    try {
      if (player) {
        player.pause();
      }
    } catch (e) {
      console.log("Audio release safe catch");
    }
    setFlash(false);
  };

  useEffect(() => {
    player.loop = true;
    player.play();

    // Loop de Hardware: Flash + Vibração Intensa
    alertInterval.current = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setFlash((prev) => !prev);
    }, 400);

    // Animação de Pulso (Foco Visual)
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

    // Efeito Scanline (Interferência)
    Animated.loop(
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
    ).start();

    return () => stopHardwareActions();
  }, []);

  const handleOpenProtocol = () => {
    stopHardwareActions();
    setIsModalVisible(true);

    // PCD: Inicia leitura automática do protocolo de emergência
    const message =
      "Atenção. Protocolo de evacuação ativado. Local: Setor de Britagem Norte. Motivo: Instabilidade de Talude. Dirija-se imediatamente ao Ponto de Encontro B.";
    Speech.speak(message, { language: "pt-BR", rate: 0.9 });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: flash ? "#D92D20" : "#000" },
      ]}
    >
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
        <Ionicons name="warning" size={120} color="#FFF" />
        <Text style={styles.alertSubtitle}>PROTOCOLO CRÍTICO</Text>
        <Text style={styles.alertTitle}>EVACUAÇÃO</Text>
        <View style={styles.dangerBadge}>
          <Text style={styles.dangerText}>CONTRASTE MÁXIMO ATIVADO</Text>
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <Button
          title="ABRIR PROTOCOLO"
          icon="shield-checkmark"
          onPress={handleOpenProtocol}
          variantStyle={styles.mainButton}
          textStyle={{ color: "#000", fontWeight: "900", fontSize: 18 }}
          accessibilityLabel="Abrir instruções de protocolo e rota de fuga"
        />
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="business" size={28} color="#D92D20" />
              <Text style={styles.modalTitle}>MMI MINERADORA</Text>
            </View>

            <Text style={styles.modalSub}>Instruções de Emergência</Text>
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
                <View
                  key={i}
                  style={styles.infoItem}
                  accessible={true}
                  accessibilityLabel={`${item.label}: ${item.val}`}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color="#D92D20"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.infoText}>
                    <Text style={styles.bold}>{item.label}:</Text> {item.val}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="OUVIR NOVAMENTE"
              icon="volume-high"
              variantStyle={{ marginTop: 20, backgroundColor: "#f1f5f9" }}
              textStyle={{ color: "#334155" }}
              onPress={() =>
                Speech.speak(
                  "Local: Britagem Norte. Motivo: Instabilidade. Rota: Ponto de Encontro B.",
                  { language: "pt-BR" },
                )
              }
            />

            <Button
              title="ENCERRAR ALERTA"
              icon="log-out"
              variantStyle={{ marginTop: 12, backgroundColor: "#1e293b" }}
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
    height: 120,
    backgroundColor: "rgba(255,255,255,0.15)",
    zIndex: 5,
  },
  alertSubtitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 20,
  },
  alertTitle: {
    color: "#fff",
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 60,
  },
  dangerBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  dangerText: {
    color: "#FFF",
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
  mainButton: { backgroundColor: "#FFF", height: 75, borderRadius: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  modalTitle: { fontSize: 24, fontWeight: "900", color: "#0f172a" },
  modalSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: { height: 2, backgroundColor: "#f1f5f9", marginVertical: 20 },
  infoRow: { gap: 12 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoText: { fontSize: 16, color: "#334155", flex: 1 },
  bold: { fontWeight: "900", color: "#000" },
  hiddenCamera: { position: "absolute", width: 1, height: 1, opacity: 0 },
});
