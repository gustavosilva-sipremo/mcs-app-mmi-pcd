import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles as g } from "../../styles/globalStyles";

interface ScreenContainerProps {
  children: React.ReactNode;
  withScroll?: boolean;
  isEmergency?: boolean; // Prop para mudar o estado visual do app em alertas
  style?: ViewStyle;
}

export const ScreenContainer = ({
  children,
  withScroll = false,
  isEmergency = false,
  style,
}: ScreenContainerProps) => {
  // Define a cor de fundo com base no estado de emergência
  const containerBackground = isEmergency
    ? "#FEF2F2"
    : g.container.backgroundColor;

  const ContentWrapper = withScroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[g.container, { backgroundColor: containerBackground }, style]}
      edges={["top", "left", "right"]} // Deixamos o bottom para controle manual ou via tabs
    >
      <StatusBar style={isEmergency ? "light" : "dark"} animated />

      <ContentWrapper
        style={styles.flex}
        contentContainerStyle={withScroll ? styles.scrollContent : styles.flex}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 20, // Espaço extra para não colar no final da tela
  },
});
