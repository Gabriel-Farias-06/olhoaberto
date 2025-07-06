"use client";

// context/ThemeContext.tsx (ou .js se preferir JS, mas recomendável .ts/.tsx com TS)
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { lightTheme, darkTheme } from "../styles/theme";
import { UserData } from "@/types/User";
import { useRouter } from "next/navigation";
import { axios } from "@/lib";

// Tipo do valor do contexto
type ThemeContextType = {
  toggleTheme: () => void;
  isDarkMode: boolean;
  theme: typeof lightTheme;
  user: UserData;
  setUser: (user: UserData) => void;
};

// Crie o contexto com o tipo correto e um valor inicial nulo
const ThemeToggleContext = createContext<ThemeContextType | null>(null);

// Componente Provider
export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<UserData>({} as UserData);
  const router = useRouter();

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (
      !window.location.href.includes("/login") &&
      !window.location.href.includes("/cadastro")
    ) {
      axios.get(`/me`).then(async (res) => {
        const _user = await res.data.user;
        setUser(_user);
      });
    }
  }, []);

  return (
    <ThemeToggleContext.Provider
      value={{ toggleTheme, isDarkMode, theme, user, setUser }}
    >
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
