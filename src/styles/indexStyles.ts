import { StyleSheet } from "react-native";
import { Colors } from "./globalStyles"; // Importando nossos novos tokens

export const indexStyles = StyleSheet.create({
  // Base para o container da Badge
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    marginBottom: 20,
    alignSelf: "center", // Garante centralização independente do container pai
  },
  badgeText: {
    fontSize: 12, // Levemente maior para melhor leitura
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: Colors.primary,
    fontSize: 32, // Escala tipográfica aumentada
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -1, // Kerning negativo para um visual mais moderno/bold
    lineHeight: 38,
  },
  description: {
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 26, // Mais espaçamento entre linhas para acessibilidade
    fontSize: 16,
    marginBottom: 40,
    paddingHorizontal: 10, // Evita que o texto encoste nas bordas do card
  },
  footer: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
