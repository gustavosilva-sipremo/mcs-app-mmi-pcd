import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

interface ScreenContainerProps {
  children: React.ReactNode;
  withScroll?: boolean;
  isEmergency?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer = ({
  children,
  withScroll = false,
  isEmergency = false,
  style,
}: ScreenContainerProps) => {
  const { theme, isHighContrast } = useTheme();

  /*
    🔴 EMERGÊNCIA sempre tem prioridade visual.
    Se estiver em emergência, ignoramos o tema.
  */
  const containerBackground = isEmergency
    ? "#450A0A"
    : theme.background;

  const ContentWrapper = withScroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: containerBackground },
        style,
      ]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        style={isEmergency || isHighContrast ? "light" : "dark"}
        animated
        backgroundColor={containerBackground}
      />

      <ContentWrapper
        style={styles.flex}
        {...(withScroll && {
          bounces: !isEmergency,
          contentContainerStyle: [
            styles.scrollContent,
            isEmergency && { justifyContent: "center" },
          ],
          showsVerticalScrollIndicator: false,
          scrollEventThrottle: 16,
        })}
      >
        {!withScroll && (
          <View
            style={[
              styles.flex,
              isEmergency && { justifyContent: "center" },
            ]}
          >
            {children}
          </View>
        )}

        {withScroll && children}
      </ContentWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
});