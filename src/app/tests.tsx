import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Text, View } from "react-native";

import {
  AlertSoundHandle,
  AlertSoundPlayer,
} from "@/components/system/AlertSoundPlayer";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { TorchButton } from "@/components/ui/TorchButton";

import { useTheme } from "@/context/ThemeContext";
import { hardwareService } from "@/services/HardwareService";

import { testsStyles as styles } from "@/styles/testsStyles";

export default function TestsScreen() {
  const router = useRouter();
  const { theme, isHighContrast } = useTheme();

  const alertSoundRef = useRef<AlertSoundHandle>(null);

  /* =========================
     HAPTIC
  ========================== */

  const handleVibration = useCallback(
    async (type: "success" | "error") => {
      if (type === "success") {
        await hardwareService.vibrateSuccess();
      } else {
        await hardwareService.vibrateError();
      }
    },
    []
  );

  /* =========================
     TTS
  ========================== */

  const testSpeech = useCallback(() => {
    hardwareService.speak(
      "Teste de sintetizador de voz. Sistema de áudio da mineradora operando normalmente.",
      {
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
            {/* VIBRAÇÃO SUCESSO */}
            <Button
              title="Vibração Sucesso"
              icon="checkmark-circle-outline"
              variantStyle={[styles.btnSuccess]}
              textStyle={{ color: isHighContrast ? "#000" : "#FFF" }}
              onPress={() => handleVibration("success")}
            />

            {/* VIBRAÇÃO ERRO */}
            <Button
              title="Vibração Erro"
              icon="close-circle-outline"
              variantStyle={[styles.btnError]}
              textStyle={{ color: "#FFF" }}
              onPress={() => handleVibration("error")}
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
            />

            {/* ALERTA SONORO */}
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

            {/* FLASH */}
            <TorchButton
              inactiveLabel="Testar Flash"
              activeLabel="Desligar Flash"
            />

            {/* DIVIDER */}
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border },
              ]}
            />

            {/* VOLTAR */}
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

        {/* PLAYER DE ALERTA */}
        <AlertSoundPlayer ref={alertSoundRef} />
      </View>
    </ScreenContainer>
  );
}