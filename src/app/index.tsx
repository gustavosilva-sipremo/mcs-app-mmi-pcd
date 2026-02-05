import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles as g } from "../styles/globalStyles";
import { indexStyles as s } from "../styles/indexStyles";

export default function Index() {
  const router = useRouter();

  // Efeito suave de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={g.container}>
      <View style={g.content}>
        {/* Glow de fundo vindo do Global */}
        <View style={g.glow} />

        <Animated.View style={[g.card, { opacity: fadeAnim }]}>
          <View style={s.badge}>
            <Text style={s.badgeText}>Acessibilidade Inclusiva</Text>
          </View>

          <Text style={s.title}>
            Hardware <Text style={g.highlight}>Testing</Text>
          </Text>

          <Text style={s.description}>
            Valide feedbacks táteis, visuais e sonoros para garantir que seu app
            seja
            <Text style={{ fontWeight: "bold", color: "#334155" }}>
              {" "}
              acessível a todos.
            </Text>
          </Text>

          <TouchableOpacity
            style={g.button}
            activeOpacity={0.7}
            onPress={() => router.push("/tests")}
          >
            <Text style={g.buttonText}>Iniciar Laboratório</Text>
          </TouchableOpacity>

          {/* Botão secundário usando composição de estilos */}
          <TouchableOpacity
            style={[
              g.button,
              { backgroundColor: "#F1F5F9", marginTop: 12, elevation: 0 },
            ]}
            activeOpacity={0.7}
            onPress={() => {
              /* Link para documentação */
            }}
          >
            <Text style={[g.buttonText, { color: "#475569" }]}>
              Ver Documentação
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ alignItems: "center" }}>
          <Text style={s.footer}>Versão 1.0.0</Text>
          <Text style={[s.footer, { marginTop: 4 }]}>
            Expo SDK 54 • TypeScript
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
