import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";

import {
  AlertSoundHandle,
  AlertSoundPlayer,
} from "../components/ui/AlertSoundPlayer";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { useTheme } from "../context/ThemeContext";
import { testsStyles as styles } from "../styles/testsStyles";

export default function TestsScreen() {
  const router = useRouter();
  const { theme, isHighContrast } = useTheme();

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // ✅ NOVO PLAYER FIXO DE ALERTA
  const alertSoundRef = useRef<AlertSoundHandle>(null);

  /* =========================
     HAPTIC
  ========================== */

  const handleVibration = useCallback(async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;

    await Haptics.notificationAsync(feedback);
  }, []);

  /* =========================
     TTS
  ========================== */

  const testSpeech = useCallback(() => {
    Speech.speak(
      "Teste de sintetizador de voz. Sistema de áudio da mineradora operando normalmente.",
      {
        language: "pt-BR",
        rate: 0.9,
        pitch: 1.0,
      }
    );
  }, []);

  /* =========================
     AUDIO (NOVO)
  ========================== */

  const playTestSound = useCallback(() => {
    alertSoundRef.current?.play();
  }, []);

  /* =========================
     FLASH
  ========================== */

  const toggleFlash = useCallback(async () => {
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

    setIsFlashOn((prev) => !prev);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [permission, requestPermission]);

  /* =========================
     RENDER
  ========================== */

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
          <Text style={[styles.title, { color: theme.text }]}>
            Painel de{" "}
            <Text style={{ color: theme.primary }}>
              Hardware
            </Text>
          </Text>

          <Text style={[styles.description, { color: theme.text }]}>
            Valide os componentes críticos de pânico e acessibilidade.
          </Text>

          <View style={styles.grid}>
            <Button
              title="Vibração Sucesso"
              icon="checkmark-circle-outline"
              variantStyle={[styles.btnSuccess]}
              textStyle={{ color: isHighContrast ? "#000" : "#FFF" }}
              onPress={() => handleVibration("success")}
            />

            <Button
              title="Vibração Erro"
              icon="close-circle-outline"
              variantStyle={[styles.btnError]}
              textStyle={{ color: "#FFF" }}
              onPress={() => handleVibration("error")}
            />

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
            />

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

            <Button
              title={isFlashOn ? "Desligar Flash" : "Testar Flash"}
              icon={isFlashOn ? "flashlight" : "flashlight-outline"}
              variantStyle={
                isFlashOn
                  ? styles.btnFlashActive
                  : {
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }
              }
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

        {/* ✅ PLAYER FIXO DE ALERTA */}
        <AlertSoundPlayer ref={alertSoundRef} />

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