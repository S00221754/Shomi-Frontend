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
    black: "#242424",
    grey0: "#3D3D3D",
    grey1: "#444444",
    grey2: "#6A6A6A",
    grey3: "#949494",
    grey4: "#C7C7C7",
    grey5: "#E5E5E5",
    greyOutline: "#BABABA",
    searchBg: "#D3EDC3",
    success: "#2FAE4E",
    warning: "#FFC107",
    error: "#FF0000",
    disabled: "#E6E6E6",
    divider: "#CEE9C8",
  },
};

const darkTheme: CreateThemeOptions = {
  mode: "dark",
  darkColors: {
    primary: "#306844",
    secondary: "#244c3a",
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
