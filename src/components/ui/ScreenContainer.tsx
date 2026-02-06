import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles as g } from "../../styles/globalStyles";

interface ScreenContainerProps {
  children: React.ReactNode;
  withScroll?: boolean;
  isEmergency?: boolean;
  style?: ViewStyle;
}

export const ScreenContainer = ({
  children,
  withScroll = false,
  isEmergency = false,
  style,
}: ScreenContainerProps) => {
  // Cores dinâmicas para feedback imediato
  const containerBackground = isEmergency
    ? "#450A0A" // Fundo vermelho escuro para emergência (melhor contraste para texto branco)
    : g.container.backgroundColor;

  const ContentWrapper = withScroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[g.container, { backgroundColor: containerBackground }, style]}
      // 'bottom' é omitido para permitir que o conteúdo flua atrás de barras de navegação transparentes
      edges={["top", "left", "right"]}
    >
      {/* A StatusBar 'light' em emergência e 'dark' no padrão garante que 
        os ícones do sistema (relógio, wifi) continuem visíveis.
      */}
      <StatusBar
        style={isEmergency ? "light" : "dark"}
        animated={true}
        backgroundColor={containerBackground} // Importante para Android
      />

      <ContentWrapper
        style={styles.flex}
        // bounce: false evita aquele efeito de 'mola' que pode desorientar em emergências
        bounces={!isEmergency}
        contentContainerStyle={[
          withScroll ? styles.scrollContent : styles.flex,
          isEmergency && { justifyContent: "center" }, // Centraliza o alerta se for emergência
        ]}
        showsVerticalScrollIndicator={false}
        // Melhora a performance de rolagem em listas complexas
        scrollEventThrottle={16}
      >
        {children}
      </ContentWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 20, // Padding dinâmico para a barra inferior
  },
});
