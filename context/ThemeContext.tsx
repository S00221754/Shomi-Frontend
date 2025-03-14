import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { ThemeProvider, createTheme, CreateThemeOptions } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

// ✅ Light Theme (Cream & Green)
const lightTheme: CreateThemeOptions = {
  mode: "light",
  lightColors: {
    primary: "#99a98f",
    secondary: "#c1d0b5",
    background: "#fff8de",
    white: "#ffffff",
    black: "#242424",
    grey0: "#393e42",
    grey1: "#43484d",
    grey2: "#5e6977",
    grey3: "#86939e",
    grey4: "#bdc6cf",
    grey5: "#e1e8ee",
    greyOutline: "#bbb",
    searchBg: "#dbead2",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff190c",
    disabled: "hsl(208, 8%, 90%)",
    divider: "#dce3c7",
  },
};

// ✅ Dark Theme (Modify as needed)
const darkTheme: CreateThemeOptions = {
  mode: "dark",
  darkColors: {
    primary: "#439ce0",
    secondary: "#aa49eb",
    background: "#080808",
    white: "#f2f2f2",
    black: "#080808",
    grey0: "#e1e8ee",
    grey1: "#bdc6cf",
    grey2: "#86939e",
    grey3: "#5e6977",
    grey4: "#43484d",
    grey5: "#393e42",
    greyOutline: "#bbb",
    searchBg: "#303337",
    success: "#439946",
    error: "#bf2c24",
    warning: "#cfbe27",
    disabled: "hsl(208, 8%, 90%)",
    divider: "#303337",
  },
};

// Define Theme Context Type
interface ThemeContextType {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage Key
const THEME_STORAGE_KEY = "user_theme_preference";

// Theme Provider Wrapper
export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme(); // Auto-detect system theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === "dark"); // Manage theme state

  // Load stored theme preference on app launch
  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === "dark");
      }
    };
    loadStoredTheme();
  }, []);

  // Toggle theme function
  const toggleTheme = async () => {
    const newMode = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode); // Save user preference
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={isDarkMode ? createTheme(darkTheme) : createTheme(lightTheme)}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook to Use Theme
export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProviderWrapper");
  }
  return context;
};
