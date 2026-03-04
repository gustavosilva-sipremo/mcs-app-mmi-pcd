import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ScreenContainer } from "../components/ui/ScreenContainer";
import { globalStyles as g } from "../styles/globalStyles";
import { indexStyles as s } from "../styles/indexStyles";

const { width } = Dimensions.get("window");
const SLIDE_WIDTH = width - 80; // Largura do container do slide
const BUTTON_SIZE = 64;
const DISTANCE_TO_UNLOCK = SLIDE_WIDTH - BUTTON_SIZE - 10;

export default function AcionamentoScreen() {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY()).current;
  const [isActivated, setIsActivated] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        // Bloqueia o movimento para trás (negativo) e limita ao final do trilho
        if (gestureState.dx >= 0 && gestureState.dx <= DISTANCE_TO_UNLOCK) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx >= DISTANCE_TO_UNLOCK * 0.9) {
          // SUCESSO NO DESLIZE
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setIsActivated(true);
          Animated.spring(pan, {
            toValue: { x: DISTANCE_TO_UNLOCK, y: 0 },
            useNativeDriver: false,
          }).start(() => {
            router.push("/alert");
          });
        } else {
          // FALHA: Volta o botão para o início
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Card animate>
          <Text style={[s.title, { textAlign: "center" }]}>
            Confirmação de <Text style={{ color: "#ef4444" }}>Alerta</Text>
          </Text>
          <Text
            style={[s.description, { marginBottom: 32, textAlign: "center" }]}
          >
            Deslize o botão para ativar o protocolo de evacuação imediata.
          </Text>

          {/* TRILHO DO SLIDE */}
          <View
            style={styles.slideTrack}
            accessible={true}
            accessibilityLabel="Trilho de ativação"
          >
            <Text style={styles.slideText}>DESLIZE PARA DISPARAR</Text>

            <Animated.View
              style={[
                styles.slideButton,
                { transform: [{ translateX: pan.x }] },
              ]}
              {...panResponder.panHandlers}
              accessible={true}
              accessibilityRole="adjustable"
              accessibilityLabel="Botão de deslize"
              accessibilityHint="Deslize para a direita para confirmar o alerta de emergência"
            >
              <Ionicons name="chevron-forward" size={32} color="#FFF" />
            </Animated.View>
          </View>

          <Button
            title="Cancelar & Voltar"
            variantStyle={[
              g.buttonSecondary,
              { marginTop: 40, borderWidth: 0 },
            ]}
            textStyle={g.buttonTextSecondary}
            onPress={() => router.back()}
          />
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slideTrack: {
    width: "100%",
    height: 80,
    backgroundColor: "#F1F5F9",
    borderRadius: 40,
    justifyContent: "center",
    padding: 8,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  slideText: {
    position: "absolute",
    alignSelf: "center",
    left: 80,
    fontSize: 14,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  slideButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: "#000",
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
