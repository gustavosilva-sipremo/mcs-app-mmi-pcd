import LogoMMI from "@/assets/images/logos/logo_mmi.svg";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { TorchButton } from "@/components/ui/TorchButton";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { hardwareService } from "@/services/HardwareService";
import { indexStyles as styles } from "@/styles/indexStyles";

export default function Index() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const { theme, toggleTheme, isHighContrast } = useTheme();

  const [batteryPercentage, setBatteryPercentage] = useState<number | null>(null);

  /* =========================
     BATTERY
  ========================= */

  useEffect(() => {
    hardwareService.initBattery();

    const loadBattery = async () => {
      const percent = hardwareService.getBatteryPercentage();
      setBatteryPercentage(percent);
    };

    loadBattery();

    const unsubscribe = hardwareService.subscribeBattery(level => {
      const percent = Math.round(level * 100);

      setBatteryPercentage(percent);

      if (level <= 0.15) {
        Alert.alert(
          "Bateria Baixa",
          "O uso do flash pode ser limitado pelo sistema."
        );
      }
    });

    return unsubscribe;
  }, []);

  const batteryVariant = batteryPercentage === null
    ? "info"
    : batteryPercentage > 20
      ? "info"
      : "warning";

  /* =========================
     NAVIGATION
  ========================= */

  const goToAcionamento = useCallback(() => {
    router.push("/acionamento");
  }, [router]);

  const goToTests = useCallback(() => {
    router.push("/tests");
  }, [router]);

  /* =========================
     RENDER
  ========================= */

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
          <View style={styles.headerRow}>
            <Badge
              title={
                batteryPercentage !== null
                  ? `Bateria: ${batteryPercentage}%`
                  : "Lendo Bateria..."
              }
              variant={batteryVariant}
            />
          </View>

          <LogoMMI width={86} height={86} style={styles.logo} />

          <Text style={[styles.title, { color: theme.text }]}>
            MMI{" "}
            <Text style={{ color: theme.primary }}>
              Mineradora
            </Text>
          </Text>

          <Text style={[styles.description, { color: theme.text }]}>
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
            />
          </View>
        </Card>
      </View>

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