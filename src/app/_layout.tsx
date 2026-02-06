import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Esconde a splash após garantir que o hardware está pronto
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Início" }} />

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
            // SEGURANÇA: Desativa gestos para evitar fechamento acidental
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
    </GestureHandlerRootView>
  );
}
