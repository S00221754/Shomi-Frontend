import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { ThemeProvider, createTheme, CreateThemeOptions } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const lightTheme: CreateThemeOptions = {
  mode: "light",
  lightColors: {
    primary: "#99BC85", // #a5d38b
    secondary: "#E4EFE7", // #c1d0b5
    background: "#FDFAF6", // #fcf5ee
    white: "#FFFFFF", // Fixed extra space issue
    black: "hsl(0, 0%, 14%)", // #242424
    grey0: "hsl(220, 6%, 24%)", // #393e42
    grey1: "hsl(215, 6%, 27%)", // #43484d
    grey2: "hsl(210, 14%, 42%)", // #5e6977
    grey3: "hsl(210, 17%, 58%)", // #86939e
    grey4: "hsl(210, 22%, 78%)", // #bdc6cf
    grey5: "hsl(210, 33%, 90%)", // #e1e8ee
    greyOutline: "hsl(0, 0%, 73%)", // #bbb
    searchBg: "hsl(96, 41%, 87%)", // #dbead2
    success: "hsl(120, 67%, 42%)", // #52c41a
    warning: "hsl(38, 90%, 54%)", // #faad14
    error: "hsl(0, 100%, 50%)", // #ff190c
    disabled: "hsl(208, 8%, 90%)",
    divider: "hsl(78, 41%, 83%)", // #dce3c7
  },
};

const darkTheme: CreateThemeOptions = {
  mode: "dark",
  darkColors: {
    primary: "#A5D38B", // Lighter green for contrast in dark mode
    secondary: "#768463", // Muted green for secondary elements
    background: "#1A1A1A", // Dark grey for comfortable contrast
    white: "#FFFFFF", // Pure white for contrast
    black: "hsl(0, 0%, 14%)", // Deep grey-black (fixed syntax)
    grey0: "#2E2E2E", // Dark grey for main surfaces
    grey1: "#383838", // Slightly lighter grey for UI depth
    grey2: "#444444", // Secondary UI elements
    grey3: "#555555", // Borders and subtle separations
    grey4: "#666666", // Lighter grey for captions or minor text
    grey5: "#777777", // Muted grey for disabled elements
    greyOutline: "#3A3A3A", // Soft grey for outlines and dividers
    searchBg: "#222222", // Darker background for search bars and inputs
    success: "#57A773", // Softer green for success messages
    warning: "#E0A800", // Warm gold for warnings
    error: "#D9534F", // Softer red for errors to reduce eye strain
    disabled: "#444444", // Muted grey to indicate disabled elements
    divider: "#333333", // Soft grey divider for sections
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
