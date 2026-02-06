import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Impede que a Splash Screen feche automaticamente antes do carregamento
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Simula um carregamento de recursos ou fontes (opcional)
    // Se você tiver fontes customizadas, carregue-as aqui.
    SplashScreen.hideAsync();
  }, []);

  return (
    // GestureHandlerRootView é essencial para evitar bugs de toque e gestos em Android/iOS
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* StatusBar configurada globalmente como dark para fundo Slate 50 */}
      <StatusBar style="dark" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          // contentStyle transparente permite que o backgroundColor venha do ScreenContainer
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
          // Desativa o gesto de voltar arrastando (importante em apps de segurança
          // para evitar que o usuário saia de um alerta por erro)
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        {/* Definimos explicitamente as rotas para melhor indexação do Router */}
        <Stack.Screen
          name="index"
          options={{
            title: "Início",
          }}
        />
        <Stack.Screen
          name="tests"
          options={{
            title: "Laboratório de Hardware",
            presentation: "card", // Garante comportamento de card no iOS
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
