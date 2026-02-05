import { Ionicons } from "@expo/vector-icons"; // Ícones nativos
import { useAudioPlayer } from "expo-audio"; // Nova biblioteca SDK 54+
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalStyles as g } from "../styles/globalStyles";
import { testsStyles as s } from "../styles/testsStyles";

export default function TestsScreen() {
  const router = useRouter();
  const [isFlashOn, setIsFlashOn] = useState(false);

  // Hook moderno do expo-audio. Ele gerencia o carregamento automaticamente.
  const audioSource = require("../assets/sounds/luva.mp3");
  const player = useAudioPlayer(audioSource);

  const [permission, requestPermission] = useCameraPermissions();

  // 📳 Feedback tátil
  const handleVibration = async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;
    await Haptics.notificationAsync(feedback);
  };

  // 🔊 Reprodução de áudio com a nova API
  const playTestSound = () => {
    try {
      if (player.playing) {
        player.seekTo(0); // Reinicia se já estiver tocando
      }
      player.play();
    } catch (error) {
      Alert.alert("Erro de Áudio", "Não foi possível reproduzir o som.");
    }
  };

  // 💡 Controle do Flash
  const toggleFlash = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permissão necessária", "Acesso à câmera negado.");
        return;
      }
    }
    setIsFlashOn(!isFlashOn);
  };

  return (
    <SafeAreaView style={g.container}>
      <ScrollView contentContainerStyle={g.content}>
        <View style={g.glow} />

        <View style={g.card}>
          <Text style={s.title}>
            Painel de <Text style={g.highlight}>Hardware</Text>
          </Text>

          <View style={s.testGrid}>
            <TouchableOpacity
              style={[g.button, s.btnSuccess]}
              activeOpacity={0.7}
              onPress={() => handleVibration("success")}
            >
              <Text style={g.buttonText}>📳 Vibração Sucesso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[g.button, s.btnError]}
              activeOpacity={0.7}
              onPress={() => handleVibration("error")}
            >
              <Text style={g.buttonText}>📳 Vibração Erro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[g.button, s.btnAudio]}
              activeOpacity={0.7}
              onPress={playTestSound}
            >
              <Text style={g.buttonText}>🔊 Ouvir "Luva.mp3"</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                g.button,
                isFlashOn ? s.btnFlashActive : s.buttonSecondary,
              ]}
              activeOpacity={0.7}
              onPress={toggleFlash}
            >
              <Text style={[g.buttonText, !isFlashOn && s.buttonTextSecondary]}>
                {isFlashOn ? "🔦 Desligar Flash" : "💡 Testar Flash (Visual)"}
              </Text>
            </TouchableOpacity>

            {/* BOTÃO VOLTAR COM ÍCONE */}
            <TouchableOpacity
              style={[
                g.button,
                s.buttonSecondary,
                { marginTop: 20, flexDirection: "row", gap: 8 },
              ]}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons name="home-outline" size={20} color="#475569" />
              <Text style={[g.buttonText, s.buttonTextSecondary]}>
                Voltar para Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isFlashOn && (
          <CameraView
            style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
            enableTorch={isFlashOn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
