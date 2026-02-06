// src/app/acionamento.tsx
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { globalStyles as g } from "../styles/globalStyles";
import { indexStyles as s } from "../styles/indexStyles";

export default function AcionamentoScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Card animate>
          <Text style={s.title}>
            Simular <Text style={{ color: "#ef4444" }}>Disparo</Text>
          </Text>
          <Text style={[s.description, { marginBottom: 24 }]}>
            Ao clicar no botão abaixo, todos os alertas de hardware serão
            acionados simultaneamente.
          </Text>

          <Button
            title="DISPARAR AGORA"
            icon="warning-outline"
            variantStyle={{ backgroundColor: "#000", height: 80 }}
            onPress={() => router.push("/alert")}
          />

          <Button
            title="Cancelar"
            variantStyle={[g.buttonSecondary, { marginTop: 12 }]}
            textStyle={g.buttonTextSecondary}
            onPress={() => router.back()}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}
