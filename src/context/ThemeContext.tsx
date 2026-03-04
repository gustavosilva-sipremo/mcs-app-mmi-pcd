import { highContrastDarkTheme, lightTheme, ThemeType } from "@/styles/themes";
import React, { createContext, useContext, useState } from "react";

type ThemeContextType = {
    theme: ThemeType;
    isHighContrast: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHighContrast, setIsHighContrast] = useState(false);

    const toggleTheme = () => {
        setIsHighContrast((prev) => !prev);
    };

    const theme = isHighContrast ? highContrastDarkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isHighContrast, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};