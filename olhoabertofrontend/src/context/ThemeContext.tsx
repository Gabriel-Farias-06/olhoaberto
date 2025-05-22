"use client";

// context/ThemeContext.tsx (ou .js se preferir JS, mas recomendável .ts/.tsx com TS)
import { createContext, useContext, useState, ReactNode } from "react";
import { lightTheme, darkTheme } from "../styles/theme";

// Tipo do valor do contexto
type ThemeContextType = {
  toggleTheme: () => void;
  isDarkMode: boolean;
  theme: typeof lightTheme;
};

// Crie o contexto com o tipo correto e um valor inicial nulo
const ThemeToggleContext = createContext<ThemeContextType | null>(null);

// Componente Provider
export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeToggleContext.Provider value={{ toggleTheme, isDarkMode, theme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
};

// Hook customizado com verificação de contexto
export const useTheme = () => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProviderCustom");
  }
  return context;
};
