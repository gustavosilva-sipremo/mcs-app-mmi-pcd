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
      {/* Centralização do conteúdo principal */}
      <View style={styles.main}>
        <Card animate>
          <Badge title="Acessibilidade Inclusiva" variant="info" />

          <Text style={s.title}>
            Hardware <Text style={g.highlight}>Testing</Text>
          </Text>

          <Text style={s.description}>
            Valide feedbacks táteis, visuais e sonoros para garantir que seu app
            seja
            <Text style={styles.boldText}> acessível a todos.</Text>
          </Text>

          <View style={styles.buttonGap}>
            <Button
              title="Iniciar Laboratório"
              icon="flask-outline"
              onPress={() => router.push("/tests")}
            />

            <Button
              title="Ver Documentação"
              icon="document-text-outline"
              // CORREÇÃO DOS ERROS TS: Usando 'g' (global) em vez de 's'
              variantStyle={g.buttonSecondary}
              textStyle={g.buttonTextSecondary}
              onPress={() => {
                /* Link para documentação */
              }}
            />
          </View>
        </Card>
      </View>

      {/* Rodapé dinâmico */}
      <View style={styles.footer}>
        <Text style={s.footer}>Versão 1.0.0</Text>
        <Text style={[s.footer, styles.miniMargin]}>
          Expo SDK 54 • TypeScript
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
    gap: 12, // Usa a propriedade gap em vez de margin individual para limpeza
  },
  boldText: {
    fontWeight: "700",
    color: Colors.primary, // Usando o token de cor que definimos
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  miniMargin: {
    marginTop: 4,
  },
});
