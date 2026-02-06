import { StyleSheet } from "react-native";
import { Colors } from "./globalStyles";

export const indexStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16, // Aumentado para melhor área visual
    paddingVertical: 8,
    borderRadius: 99,
    marginBottom: 20,
    alignSelf: "flex-start", // Mudança estratégica: alinhamento à esquerda facilita a leitura em listas
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)", // Sutil borda para definição em telas de baixa qualidade
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900", // Peso máximo para contraste
    letterSpacing: 1, // Espaçamento maior para evitar confusão de caracteres
    textTransform: "uppercase",
  },
  title: {
    color: Colors.primary,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1.2,
    lineHeight: 40,
    // Sombra sutil para "descolar" o texto do fundo em ambientes muito claros
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: Colors.secondary,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
    fontWeight: "500", // Médio para não perder legibilidade
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  footer: {
    color: "#64748B", // Escurecido de 400 para 600 para atingir contraste WCAG
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
});
