import LogoMMI from "@/assets/images/logos/logo_mmi.svg";
import * as Battery from "expo-battery";
import { Camera, CameraView } from "expo-camera";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";

import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const { theme, toggleTheme, isHighContrast } = useTheme();

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
          "O uso do flash em emergências pode ser limitado pelo sistema de economia de energia."
        );
      }
    });

    return () => subscription.remove();
  }, []);

  const toggleTorch = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();

    if (granted) {
      setIsTorchOn(!isTorchOn);
    } else {
      Alert.alert(
        "Acesso Negado",
        "A permissão de câmera é obrigatória para utilizar a lanterna de serviço."
      );
    }
  };

  return (
    <ScreenContainer
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.main}>
        <Card
          animate
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          <View style={styles.headerRow}>
            <Badge
              title={
                batteryLevel !== null
                  ? `Bateria: ${Math.round(batteryLevel * 100)}%`
                  : "Lendo Bateria..."
              }
              variant={
                batteryLevel !== null && batteryLevel > 0.2
                  ? "info"
                  : "warning"
              }
              accessibilityLabel={`Nível de bateria atual: ${batteryLevel ? Math.round(batteryLevel * 100) : 0
                } por cento`}
            />
          </View>

          <LogoMMI width={86} height={86} style={styles.logo} />

          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            MMI{" "}
            <Text style={{ color: theme.primary }}>
              Mineradora
            </Text>
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.text },
            ]}
          >
            Receba alertas importantes e
            <Text style={{ fontWeight: "800", color: theme.primary }}>
              {" "}conte com suporte acessível quando precisar.
            </Text>
          </Text>

          <View style={styles.buttonGap}>
            <Button
              title="Simular Acionamento"
              icon="megaphone-outline"
              variantStyle={{
                backgroundColor: theme.danger,
                height: 70,
              }}
              textStyle={{ color: "#FFF" }}
              accessibilityLabel="Iniciar simulação de alerta de emergência"
              accessibilityHint="Abre a tela de ativação do protocolo de pânico"
              onPress={() => router.push("/acionamento")}
            />

            <Button
              title="Teste de Hardware"
              icon="flask-outline"
              variantStyle={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{ color: theme.text }}
              accessibilityLabel="Laboratório de testes"
              accessibilityHint="Verifica o funcionamento dos sensores de hardware"
              onPress={() => router.push("/tests")}
            />

            <Button
              title={isTorchOn ? "Desligar Lanterna" : "Lanterna de Serviço"}
              icon={isTorchOn ? "flashlight" : "flashlight-outline"}
              variantStyle={{
                backgroundColor: isTorchOn
                  ? theme.primary
                  : theme.card,
                borderWidth: 1,
                borderColor: theme.border,
              }}
              textStyle={{
                color: isTorchOn
                  ? "#000"
                  : theme.text,
              }}
              onPress={toggleTorch}
              accessibilityLabel={
                isTorchOn
                  ? "Desligar lanterna"
                  : "Ligar lanterna de serviço"
              }
            />

            {/* BOTÃO DE TEMA */}
            <Button
              title={
                isHighContrast
                  ? "Modo Normal"
                  : "Modo Alto Contraste"
              }
              icon="contrast-outline"
              variantStyle={{
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.primary,
              }}
              textStyle={{
                color: theme.primary,
                fontWeight: "700",
              }}
              onPress={toggleTheme}
              accessibilityLabel="Alternar tema de alto contraste"
            />
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: theme.text, opacity: 0.7 }}>
          Segurança & Acessibilidade
        </Text>
        <Text style={{ color: theme.text, opacity: 0.5, marginTop: 4 }}>
          Versão {appVersion}
        </Text>
      </View>

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
  container: {
    paddingHorizontal: 24,
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  description: {
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  buttonGap: {
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
  logo: {
    alignSelf: "center",
    marginVertical: 6,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});