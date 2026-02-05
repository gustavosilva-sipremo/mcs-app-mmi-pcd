import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Círculo de Brilho Decorativo (Opcional) */}
        <View style={styles.glow} />

        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SISTEMA NATIVO</Text>
          </View>

          <Text style={styles.title}>
            React <Text style={styles.highlight}>Native</Text>
          </Text>

          <Text style={styles.description}>
            Desenvolvendo com StyleSheet padrão. Estabilidade, performance e
            controle total sobre a interface.
          </Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Começar Agora</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Expo SDK 54 • TypeScript</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // Slate 950
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  glow: {
    position: "absolute",
    top: -100,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#0ea5e9",
    borderRadius: width,
    opacity: 0.1,
    filter: "blur(50px)", // Nota: Funciona melhor no iOS/Web, omitido no Android antigo
  },
  card: {
    width: "100%",
    backgroundColor: "#0f172a", // Slate 900
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#1e293b", // Slate 800
    alignItems: "center",
    elevation: 10, // Sombra Android
    shadowColor: "#000", // Sombra iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  badge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginBottom: 16,
  },
  badgeText: {
    color: "#10b981", // Emerald 500
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  highlight: {
    color: "#0ea5e9", // Sky 500
  },
  description: {
    color: "#94a3b8", // Slate 400
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#0ea5e9",
    width: "100%",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 24,
    color: "#475569",
    fontSize: 12,
    fontWeight: "500",
  },
});
