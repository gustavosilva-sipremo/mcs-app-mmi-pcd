import LogoMMI from "@/assets/images/logos/logo_mmi.svg";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { TorchButton } from "@/components/ui/TorchButton";
import * as Battery from "expo-battery";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { indexStyles as styles } from "@/styles/indexStyles";

export default function Index() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const { theme, toggleTheme, isHighContrast } = useTheme();

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  /* =========================
     BATTERY
  ========================== */

  useEffect(() => {
    const loadBatteryLevel = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
    };

    loadBatteryLevel();

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

  const batteryPercentage = useMemo(() => {
    return batteryLevel !== null ? Math.round(batteryLevel * 100) : null;
  }, [batteryLevel]);

  const batteryVariant = useMemo(() => {
    if (batteryLevel === null) return "info";
    return batteryLevel > 0.2 ? "info" : "warning";
  }, [batteryLevel]);

  /* =========================
     NAVIGATION
  ========================== */

  const goToAcionamento = useCallback(() => {
    router.push("/acionamento");
  }, [router]);

  const goToTests = useCallback(() => {
    router.push("/tests");
  }, [router]);

  /* =========================
     RENDER
  ========================== */

  return (
    <ScreenContainer
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.main}>
        <Card
          animate
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
          }}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Badge
              title={
                batteryPercentage !== null
                  ? `Bateria: ${batteryPercentage}%`
                  : "Lendo Bateria..."
              }
              variant={batteryVariant}
              accessibilityLabel={`Nível de bateria atual: ${batteryPercentage ?? 0
                } por cento`}
            />
          </View>

          {/* LOGO */}
          <LogoMMI width={86} height={86} style={styles.logo} />

          {/* TITLE */}
          <Text style={[styles.title, { color: theme.text }]}>
            MMI{" "}
            <Text style={{ color: theme.primary }}>
              Mineradora
            </Text>
          </Text>

          {/* DESCRIPTION */}
          <Text style={[styles.description, { color: theme.text }]}>
            Receba alertas importantes e
            <Text style={{ fontWeight: "800", color: theme.primary }}>
              {" "}conte com suporte acessível quando precisar.
            </Text>
          </Text>

          {/* BUTTONS */}
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
              onPress={goToAcionamento}
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
              onPress={goToTests}
            />

            <TorchButton />

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

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <Text style={[styles.footerText, { color: theme.text, opacity: 0.7 }]}>
          © 2026 Sipremo MCS
        </Text>

        <Text style={{ color: theme.text, opacity: 0.5, marginTop: 4 }}>
          Versão {appVersion}
        </Text>
      </View>
    </ScreenContainer>
  );
}