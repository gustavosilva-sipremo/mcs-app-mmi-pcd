import { TorchController } from "@/components/system/TorchController";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TorchProvider } from "@/context/TorchProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

/**
 * Layout interno que consome o tema.
 * TorchProvider fica aqui para envolver TODAS as telas.
 */
function AppLayout() {
  const { theme, isHighContrast } = useTheme();

  return (
    <TorchProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* StatusBar dinâmica baseada no tema */}
        <StatusBar
          style={isHighContrast ? "light" : "dark"}
          backgroundColor={theme.background}
          translucent={false}
        />

        {/* Stack principal */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.background,
            },
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Início" }}
          />

          <Stack.Screen
            name="acionamento"
            options={{
              title: "Confirmar Alerta",
              presentation: "modal",
            }}
          />

          <Stack.Screen
            name="alert"
            options={{
              title: "EMERGÊNCIA",
              gestureEnabled: false,
              animation: "fade",
            }}
          />

          <Stack.Screen
            name="tests"
            options={{
              title: "Laboratório de Hardware",
              presentation: "card",
            }}
          />
        </Stack>

        {/* Controller global da lanterna (fora do Stack) */}
        <TorchController />
      </View>
    </TorchProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // Aqui você poderia carregar fontes, assets etc
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}