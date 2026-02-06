import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech"; // Adicionado para teste de acessibilidade
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";

import { globalStyles as g } from "../styles/globalStyles";
import { testsStyles as s } from "../styles/testsStyles";

export default function TestsScreen() {
  const router = useRouter();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const player = useAudioPlayer(require("../assets/sounds/metal_gear.mp3"));

  // 📳 Feedback tátil refinado
  const handleVibration = async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;
    await Haptics.notificationAsync(feedback);
  };

  // 🗣️ Teste de Voz (PCD)
  const testSpeech = () => {
    const message =
      "Teste de sintetizador de voz. Sistema de áudio da mineradora operando normalmente.";
    Speech.speak(message, {
      language: "pt-BR",
      rate: 0.9,
      pitch: 1.0,
    });
  };

  // 🔊 Som de teste
  const playTestSound = () => {
    try {
      if (player.playing) player.seekTo(0);
      player.play();
    } catch (error) {
      Alert.alert(
        "Erro de Áudio",
        "Não foi possível reproduzir o som de alerta.",
      );
    }
  };

  // 🔦 Controle da Lanterna (Flash)
  const toggleFlash = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permissão necessária",
          "O acesso à câmera é obrigatório para o flash.",
        );
        return;
      }
    }
    setIsFlashOn(!isFlashOn);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <ScreenContainer withScroll>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card animate>
          <Text style={s.title}>
            Painel de <Text style={g.highlight}>Hardware</Text>
          </Text>

          <Text
            style={[s.description, { marginBottom: 20, textAlign: "center" }]}
          >
            Valide os componentes críticos de pânico e acessibilidade.
          </Text>

          <View style={s.testGrid}>
            <Button
              title="Vibração Sucesso"
              icon="checkmark-circle-outline"
              variantStyle={s.btnSuccess}
              onPress={() => handleVibration("success")}
              accessibilityLabel="Testar vibração de sucesso"
            />

            <Button
              title="Vibração Erro"
              icon="close-circle-outline"
              variantStyle={s.btnError}
              onPress={() => handleVibration("error")}
              accessibilityLabel="Testar vibração de erro"
            />

            <Button
              title="Testar Voz (TTS)"
              icon="chatbubble-ellipses-outline"
              variantStyle={{ backgroundColor: "#8B5CF6" }} // Roxo para distinguir
              onPress={testSpeech}
              accessibilityLabel="Testar síntese de voz para deficientes visuais"
            />

            <Button
              title="Ouvir Alarme"
              icon="volume-high-outline"
              variantStyle={s.btnAudio}
              onPress={playTestSound}
            />

            <Button
              title={isFlashOn ? "Desligar Flash" : "Testar Flash"}
              icon={isFlashOn ? "flashlight" : "flashlight-outline"}
              variantStyle={isFlashOn ? s.btnFlashActive : g.buttonSecondary}
              textStyle={!isFlashOn ? g.buttonTextSecondary : { color: "#FFF" }}
              onPress={toggleFlash}
            />

            <View style={styles.divider} />

            <Button
              title="Voltar para Home"
              icon="home-outline"
              variantStyle={g.buttonSecondary}
              textStyle={g.buttonTextSecondary}
              onPress={() => router.back()}
            />
          </View>
        </Card>

        {permission?.granted && (
          <CameraView
            style={styles.hiddenCamera}
            enableTorch={isFlashOn}
            facing="back"
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    justifyContent: "center",
    minHeight: "100%",
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    width: "100%",
    marginVertical: 10,
  },
});
