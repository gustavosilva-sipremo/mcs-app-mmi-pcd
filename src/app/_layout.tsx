import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

SplashScreen.preventAutoHideAsync();

/*
  Componente interno que consome o tema.
  Separado para que o Provider envolva tudo corretamente.
*/
function ThemedLayout() {
  const { theme, isHighContrast } = useTheme();

  return (
    <>
      {/* StatusBar dinâmica baseada no tema */}
      <StatusBar
        style={isHighContrast ? "light" : "dark"}
        backgroundColor={theme.background}
        translucent={false}
      />

      {/* Background global real do app */}
      <View style={{ flex: 1, backgroundColor: theme.background }}>
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
      </View>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}