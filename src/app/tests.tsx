import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useCallback, useRef } from "react";
import { Text, View } from "react-native";

import {
  AlertSoundHandle,
  AlertSoundPlayer,
} from "@/components/ui/AlertSoundPlayer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { TorchButton } from "@/components/ui/TorchButton";
import { useTheme } from "@/context/ThemeContext";
import { testsStyles as styles } from "@/styles/testsStyles";

export default function TestsScreen() {
  const router = useRouter();
  const { theme, isHighContrast } = useTheme();

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
     AUDIO
  ========================== */

  const playTestSound = useCallback(() => {
    alertSoundRef.current?.play();
  }, []);

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

            <TorchButton
              inactiveLabel="Testar Flash"
              activeLabel="Desligar Flash"
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

        <AlertSoundPlayer ref={alertSoundRef} />
      </View>
    </ScreenContainer>
  );
}