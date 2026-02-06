import { useAudioPlayer } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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

  const player = useAudioPlayer(require("../assets/sounds/luva.mp3"));

  // 📳 Feedback tátil refinado
  const handleVibration = async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;
    await Haptics.notificationAsync(feedback);
  };

  // 🔊 Som de teste
  const playTestSound = () => {
    try {
      if (player.playing) player.seekTo(0);
      player.play();
    } catch (error) {
      Alert.alert("Erro de Áudio", "Não foi possível reproduzir o som.");
    }
  };

  // 🔦 Controle da Lanterna (Flash)
  const toggleFlash = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à câmera para usar o flash.",
        );
        return;
      }
    }
    setIsFlashOn(!isFlashOn);
    // Adiciona um haptic ao ligar/desligar a lanterna
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

          <View style={s.testGrid}>
            <Button
              title="Vibração Sucesso"
              icon="checkmark-circle-outline"
              variantStyle={s.btnSuccess}
              onPress={() => handleVibration("success")}
            />

            <Button
              title="Vibração Erro"
              icon="close-circle-outline"
              variantStyle={s.btnError}
              onPress={() => handleVibration("error")}
            />

            <Button
              title="Ouvir Áudio"
              icon="volume-high-outline"
              variantStyle={s.btnAudio}
              onPress={playTestSound}
            />

            <Button
              title={isFlashOn ? "Desligar Lanterna" : "Testar Flash"}
              icon={isFlashOn ? "flashlight" : "flashlight-outline"}
              variantStyle={isFlashOn ? s.btnFlashActive : g.buttonSecondary}
              textStyle={!isFlashOn ? g.buttonTextSecondary : { color: "#FFF" }}
              onPress={toggleFlash}
            />

            <Button
              title="Voltar para Home"
              icon="home-outline"
              variantStyle={[g.buttonSecondary, { marginTop: 8 }]}
              textStyle={g.buttonTextSecondary}
              onPress={() => router.back()}
            />
          </View>
        </Card>

        {/* CÂMERA INVISÍVEL: 
          Necessária para acessar o hardware do Flash (enableTorch).
          Mantemos 1x1 pixel e opacity 0 para não interferir no visual.
        */}
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
});
