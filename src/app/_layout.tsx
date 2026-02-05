import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* 'dark' faz com que os ícones (bateria, hora) fiquem pretos, ideal para fundo claro */}
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          // Mantém o fundo consistente durante a transição entre telas
          contentStyle: { backgroundColor: "#F8FAFC" },
          // Adiciona uma animação de deslize lateral (estilo iOS) que é bem elegante
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="tests" />
      </Stack>
    </View>
  );
}
