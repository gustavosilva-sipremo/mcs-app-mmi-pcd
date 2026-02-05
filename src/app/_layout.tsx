import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false, // UI mais moderna sem a barra superior padrão
          contentStyle: { backgroundColor: "#020617" },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}
