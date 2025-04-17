import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { ThemeProvider, createTheme, CreateThemeOptions } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const lightTheme: CreateThemeOptions = {
  mode: "light",
  lightColors: {
    primary: "#99BC85",
    secondary: "#AFCB9F",
    background: "#FDFAF6",
    white: "#FFFFFF",
    black: "hsl(0, 0%, 14%)",
    grey0: "hsl(220, 6%, 24%)",
    grey1: "hsl(215, 6%, 27%)",
    grey2: "hsl(210, 14%, 42%)",
    grey3: "hsl(210, 17%, 58%)",
    grey4: "hsl(210, 22%, 78%)",
    grey5: "hsl(210, 33%, 90%)",
    greyOutline: "hsl(0, 0%, 73%)",
    searchBg: "hsl(96, 41%, 87%)",
    success: "hsl(120, 67%, 42%)",
    warning: "hsl(38, 90%, 54%)",
    error: "hsl(0, 100%, 50%)",
    disabled: "hsl(208, 8%, 90%)",
    divider: "hsl(78, 41%, 83%)",
  },
};

const darkTheme: CreateThemeOptions = {
  mode: "dark",
  darkColors: {
    primary: "#306844",
    secondary: "#182c25",
    background: "#1A1A1A",
    white: "#FFFFFF",
    black: "hsl(0, 0%, 14%)",
    grey0: "#2E2E2E",
    grey1: "#383838",
    grey2: "#444444",
    grey3: "#555555",
    grey4: "#666666",
    grey5: "#777777",
    greyOutline: "#3A3A3A",
    searchBg: "#222222",
    success: "#57A773",
    warning: "#E0A800",
    error: "#D9534F",
    disabled: "#444444",
    divider: "#333333",
  },
};

const THEME_STORAGE_KEY = "user_theme_preference";

interface ThemeContextType {
  toggleTheme: () => void;
  isDarkMode: boolean;
  theme: ReturnType<typeof createTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  const theme = isDarkMode ? createTheme(darkTheme) : createTheme(lightTheme);

  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === "dark");
      }
    };
    loadStoredTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProviderWrapper");
  }
  return context;
};
