import { Audio } from "expo-av";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeStyles as styles } from "./styles/styles";

export default function TestsScreen() {
  const router = useRouter();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Hook para gerenciar permissões de câmera de forma moderna
  const [permission, requestPermission] = useCameraPermissions();

  // Cleanup: Descarrega o som da memória quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // 📳 Feedback tátil para PCD (Deficiência Visual/Auditiva)
  const handleVibration = async (type: "success" | "error") => {
    const feedback =
      type === "success"
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error;
    await Haptics.notificationAsync(feedback);
  };

  // 🔊 Alerta sonoro usando arquivo local luva.mp3
  const playTestSound = async () => {
    try {
      // Se já houver um som carregado, para e descarrega antes de tocar novamente
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/luva.mp3"), // Caminho para seu arquivo local
      );

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro de Áudio",
        "Não foi possível carregar o arquivo 'luva.mp3'. Verifique se ele está na pasta assets/sounds.",
      );
    }
  };

  // 💡 Alerta visual via Flash (Deficiência Auditiva)
  const toggleFlash = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permissão necessária",
          "O acesso à câmera é obrigatório para ativar o flash como sinalizador visual.",
        );
        return;
      }
    }
    setIsFlashOn(!isFlashOn);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Efeito visual de fundo */}
        <View style={styles.glow} />

        <View style={styles.card}>
          <Text style={styles.title}>
            Painel de <Text style={styles.highlight}>Hardware</Text>
          </Text>

          <View style={styles.testGrid}>
            {/* VIBRAÇÃO SUCESSO */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#10b981" }]}
              activeOpacity={0.7}
              onPress={() => handleVibration("success")}
            >
              <Text style={styles.buttonText}>📳 Vibração Sucesso</Text>
            </TouchableOpacity>

            {/* VIBRAÇÃO ERRO */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ef4444" }]}
              activeOpacity={0.7}
              onPress={() => handleVibration("error")}
            >
              <Text style={styles.buttonText}>📳 Vibração Erro</Text>
            </TouchableOpacity>

            {/* TESTE DE SOM LOCAL */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#6366f1" }]}
              activeOpacity={0.7}
              onPress={playTestSound}
            >
              <Text style={styles.buttonText}>🔊 Ouvir "Luva.mp3"</Text>
            </TouchableOpacity>

            {/* TESTE DE FLASH */}
            <TouchableOpacity
              style={[
                styles.button,
                isFlashOn
                  ? { backgroundColor: "#f59e0b" }
                  : styles.buttonSecondary,
              ]}
              activeOpacity={0.7}
              onPress={toggleFlash}
            >
              <Text
                style={[
                  styles.buttonText,
                  !isFlashOn && styles.buttonTextSecondary,
                ]}
              >
                {isFlashOn ? "🔦 Desligar Flash" : "💡 Testar Flash (Visual)"}
              </Text>
            </TouchableOpacity>

            {/* BOTÃO VOLTAR */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary, { marginTop: 20 }]}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                Voltar para Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Componente de Câmera invisível para controle do hardware.
            No iOS/Android, o torch (lanterna) só funciona se uma instância da câmera existir.
        */}
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
