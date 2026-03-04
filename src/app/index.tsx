import * as Battery from "expo-battery";
import Constants from "expo-constants";
// A Expo Camera agora separa o Componente (CameraView) das funções (Camera)
import LogoMMI from "@/assets/images/logos/logo_mmi.svg";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";

import { Colors, globalStyles as g } from "../styles/globalStyles";
import { indexStyles as s } from "../styles/indexStyles";

export default function Index() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);


  useEffect(() => {
    const updateBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
    };

    updateBattery();
    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
      if (batteryLevel <= 0.15) {
        Alert.alert(
          "Bateria Baixa",
          "O uso do flash em emergências pode ser limitado pelo sistema de economia de energia.",
        );
      }
    });

    return () => subscription.remove();
  }, []);

  const toggleTorch = async () => {
    // Usando o objeto Camera para gerenciar permissões (Estático)
    const { granted } = await Camera.requestCameraPermissionsAsync();

    if (granted) {
      setIsTorchOn(!isTorchOn);
    } else {
      Alert.alert(
        "Acesso Negado",
        "A permissão de câmera é obrigatória para utilizar a lanterna de serviço.",
      );
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.main}>
        <Card animate>
          <View style={styles.headerRow}>
            <Badge
              title={
                batteryLevel !== null
                  ? `Bateria: ${Math.round(batteryLevel * 100)}%`
                  : "Lendo Bateria..."
              }
              variant={
                batteryLevel !== null && batteryLevel > 0.2 ? "info" : "warning"
              }
              accessibilityLabel={`Nível de bateria atual: ${batteryLevel ? Math.round(batteryLevel * 100) : 0} por cento`}
            />
          </View>

          <LogoMMI width={86} height={86} style={styles.logo} />

          <Text style={[s.title, styles.titleAdjust]}>
            MMI <Text style={g.highlight}>Mineradora</Text>
          </Text>

          <Text style={s.description}>
            Receba alertas importantes e
            <Text style={styles.boldText}>
              {" "}conte com suporte acessível quando precisar.
            </Text>
          </Text>

          <View style={styles.buttonGap}>
            <Button
              title="Simular Acionamento"
              icon="megaphone-outline"
              variantStyle={styles.btnEmergency}
              accessibilityLabel="Iniciar simulação de alerta de emergência"
              accessibilityHint="Abre a tela de ativação do protocolo de pânico"
              onPress={() => router.push("/acionamento")}
            />

            <Button
              title="Teste de Hardware"
              icon="flask-outline"
              variantStyle={g.buttonSecondary}
              textStyle={g.buttonTextSecondary}
              accessibilityLabel="Laboratório de testes"
              accessibilityHint="Verifica o funcionamento dos sensores de hardware"
              onPress={() => router.push("/tests")}
            />

            <Button
              title={isTorchOn ? "Desligar Lanterna" : "Lanterna de Serviço"}
              icon={isTorchOn ? "flashlight" : "flashlight-outline"}
              // Solução para o erro de estilo do TS: se falso, retorna um objeto vazio {}
              variantStyle={[
                styles.btnUtility,
                isTorchOn ? styles.btnActive : {},
              ]}
              textStyle={
                isTorchOn ? { color: "#FFF" } : { color: Colors.primary }
              }
              onPress={toggleTorch}
              accessibilityLabel={
                isTorchOn ? "Desligar lanterna" : "Ligar lanterna de serviço"
              }
            />
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={s.footer}>Segurança & Acessibilidade</Text>
        <Text style={[s.footer, styles.miniMargin]}>
          Versão {appVersion}
        </Text>
      </View>

      {/* Componente CameraView utilizado corretamente para o Flash */}
      {isTorchOn && (
        <CameraView
          style={styles.hiddenCamera}
          enableTorch={isTorchOn}
          facing="back"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24 },
  main: { flex: 1, justifyContent: "center", width: "100%" },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 6,
  },
  titleAdjust: { marginTop: 10 },
  buttonGap: { width: "100%", gap: 12, marginTop: 8 },
  btnEmergency: {
    backgroundColor: Colors.danger,
    height: 70,
    shadowColor: Colors.danger,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnUtility: {
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  logo: {
    width: 86,
    height: 86,
    alignSelf: "center",
    marginVertical: 6,
  },
  boldText: { fontWeight: "800", color: Colors.primary },
  footer: { alignItems: "center", paddingBottom: 30 },
  miniMargin: { marginTop: 4 },
  hiddenCamera: { position: "absolute", width: 1, height: 1, opacity: 0 },
});
