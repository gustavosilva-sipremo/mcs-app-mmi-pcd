import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { useTheme } from "../context/ThemeContext";

export default function TestsScreen() {
  const router = useRouter();
  const { theme, isHighContrast } = useTheme();

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const player = useAudioPlayer(require("../assets/sounds/metal_gear.mp3"));

  /* 📳 Feedback Tátil */
  const handleVibration = async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;

    await Haptics.notificationAsync(feedback);
  };

  /* 🗣️ Teste de Voz */
  const testSpeech = () => {
    const message =
      "Teste de sintetizador de voz. Sistema de áudio da mineradora operando normalmente.";

    Speech.speak(message, {
      language: "pt-BR",
      rate: 0.9,
      pitch: 1.0,
    });
  };

  /* 🔊 Som de teste */
  const playTestSound = () => {
    try {
      if (player.playing) player.seekTo(0);
      player.play();
    } catch {
      Alert.alert(
        "Erro de Áudio",
        "Não foi possível reproduzir o som de alerta."
      );
    }
  };

  /* 🔦 Flash */
  const toggleFlash = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permissão necessária",
          "O acesso à câmera é obrigatório para o flash."
        );
        return;
      }
    }

    setIsFlashOn(!isFlashOn);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return (
    <ScreenContainer withScroll>
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
            Painel de{" "}
            <Text style={{ color: theme.primary }}>
              Hardware
            </Text>
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.text },
            ]}
          >
            Valide os componentes críticos de pânico e acessibilidade.
          </Text>

          <View style={styles.grid}>
            {/* Vibração Sucesso */}
            <Button
              title="Vibração Sucesso"
              icon="checkmark-circle-outline"
              variantStyle={{
                backgroundColor: theme.primary,
              }}
              textStyle={{
                color: isHighContrast ? "#000" : "#FFF",
              }}
              onPress={() => handleVibration("success")}
              accessibilityLabel="Testar vibração de sucesso"
            />

            {/* Vibração Erro */}
            <Button
              title="Vibração Erro"
              icon="close-circle-outline"
              variantStyle={{
                backgroundColor: theme.danger,
              }}
              textStyle={{ color: "#FFF" }}
              onPress={() => handleVibration("error")}
              accessibilityLabel="Testar vibração de erro"
            />

            {/* TTS */}
            <Button
              title="Testar Voz (TTS)"
              icon="chatbubble-ellipses-outline"
              variantStyle={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.primary,
              }}
              textStyle={{
                color: theme.primary,
                fontWeight: "700",
              }}
              onPress={testSpeech}
              accessibilityLabel="Testar síntese de voz para deficientes visuais"
            />

            {/* Áudio */}
            <Button
              title="Ouvir Alarme"
              icon="volume-high-outline"
              variantStyle={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{ color: theme.text }}
              onPress={playTestSound}
            />

            {/* Flash */}
            <Button
              title={isFlashOn ? "Desligar Flash" : "Testar Flash"}
              icon={isFlashOn ? "flashlight" : "flashlight-outline"}
              variantStyle={{
                backgroundColor: isFlashOn
                  ? theme.primary
                  : theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{
                color: isFlashOn
                  ? isHighContrast
                    ? "#000"
                    : "#FFF"
                  : theme.text,
              }}
              onPress={toggleFlash}
            />

            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* Voltar */}
            <Button
              title="Voltar"
              icon="home-outline"
              variantStyle={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{ color: theme.text }}
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
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    gap: 12,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 10,
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});