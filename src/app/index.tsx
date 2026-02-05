import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeStyles as styles } from "./styles/styles";

export default function Index() {
  const router = useRouter();

  // Efeito suave de entrada (opcional, mas deixa elegante)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* O Glow no tema light age como uma mancha de cor suave ao fundo */}
        <View style={styles.glow} />

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Acessibilidade Inclusiva</Text>
          </View>

          <Text style={styles.title}>
            Hardware <Text style={styles.highlight}>Testing</Text>
          </Text>

          <Text style={styles.description}>
            Valide feedbacks táteis, visuais e sonoros para garantir que seu app
            seja
            <Text style={{ fontWeight: "bold", color: "#334155" }}>
              {" "}
              acessível a todos.
            </Text>
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push("/tests")}
          >
            <Text style={styles.buttonText}>Iniciar Laboratório</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            activeOpacity={0.7}
            onPress={() => {
              /* Link para documentação ou ajuda */
            }}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Ver Documentação
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.footer}>Versão 1.0.0</Text>
          <Text style={[styles.footer, { marginTop: 4 }]}>
            Expo SDK 54 • TypeScript
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
