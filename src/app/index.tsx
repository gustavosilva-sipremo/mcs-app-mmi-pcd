import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";

import { Colors, globalStyles as g } from "../styles/globalStyles";
import { indexStyles as s } from "../styles/indexStyles";

export default function Index() {
  const router = useRouter();

  return (
    <ScreenContainer style={styles.container}>
      {/* O Glow global já está no ScreenContainer/Card, garantindo o visual */}
      <View style={styles.main}>
        <Card animate>
          <Badge title="Monitoramento Ativo" variant="info" />

          <Text style={s.title}>
            MMI <Text style={g.highlight}>Mineradora</Text>
          </Text>

          <Text style={s.description}>
            Gestão de protocolos de emergência e
            <Text style={styles.boldText}>
              {" "}
              validação de hardware inclusivo.
            </Text>
          </Text>

          <View style={styles.buttonGap}>
            {/* Botão de Destaque: Simulação */}
            <Button
              title="Simular Acionamento"
              icon="megaphone-outline"
              variantStyle={styles.btnEmergency}
              onPress={() => router.push("/acionamento")}
            />

            {/* Botão Secundário: Laboratório */}
            <Button
              title="Laboratório de Hardware"
              icon="flask-outline"
              variantStyle={g.buttonSecondary}
              textStyle={g.buttonTextSecondary}
              onPress={() => router.push("/tests")}
            />
          </View>
        </Card>
      </View>

      {/* Rodapé institucional */}
      <View style={styles.footer}>
        <Text style={s.footer}>Segurança e Acessibilidade</Text>
        <Text style={[s.footer, styles.miniMargin]}>
          Versão 1.2.0 • Estável
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  buttonGap: {
    width: "100%",
    gap: 12,
  },
  btnEmergency: {
    backgroundColor: "#EF4444", // Vermelho Alerta
    height: 65, // Ligeiramente maior para destaque
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  boldText: {
    fontWeight: "800",
    color: Colors.primary,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  miniMargin: {
    marginTop: 4,
  },
});
