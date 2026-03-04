export type ThemeType = {
  background: string;
  card: string;
  text: string;
  primary: string;
  border: string;
  danger: string;
};

export const lightTheme: ThemeType = {
  background: "#F4F6F8",
  card: "#FFFFFF",
  text: "#1A1A1A",
  primary: "#0057FF",
  border: "#E0E0E0",
  danger: "#D32F2F",
};

export const highContrastDarkTheme: ThemeType = {
  background: "#000000",
  card: "#121212",
  text: "#FFFFFF",
  primary: "#FFFF00", // Amarelo alto contraste
  border: "#FFFFFF",
  danger: "#FF3B3B",
};
