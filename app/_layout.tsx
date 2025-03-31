import "react-native-get-random-values";
import { Buffer } from "buffer";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProviderWrapper, useAppTheme } from "@/context/ThemeContext";
import { useTheme } from "@rneui/themed";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import React from "react";

// @ts-ignore
if (typeof global.Buffer === "undefined") {
  // @ts-ignore
  global.Buffer = Buffer;
}

// Suppress 10tap editor "not ready" warning reason: there is an internal issue with the package that causes this warning to be shown even when the editor is ready.
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === "string" && message.includes("Editor isn't ready yet")) {
    return;
  }
  originalWarn(...args);
};

function AppLayout() {
  const { isDarkMode } = useAppTheme();
  const { theme } = useTheme();

  const statusBarStyle = isDarkMode ? "light" : "dark";
  const statusBarBackground = theme.colors.background;
  const primaryColor = theme.colors.primary;

  return (
    <>
      <StatusBar style={statusBarStyle} backgroundColor={statusBarBackground} />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth-callback" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipes/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: primaryColor,
            headerShadowVisible: true,
            headerTitle: "",
          }}
        />

        <Stack.Screen
          name="recipes/recommendedRecipesScreen"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: primaryColor,
            headerShadowVisible: true,
            headerTitle: "",
          }}
        />

        <Stack.Screen
          name="ingredients/ingredient-list"
          options={{
            headerTitle: "Ingredient List",
            headerTitleStyle: {
              color: primaryColor,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: primaryColor,
          }}
        />

        <Stack.Screen
          name="recipes/recipeFormScreen"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: primaryColor,
            headerShadowVisible: true,
            headerTitle: "Add Recipe",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <AppLayout />
        <Toast />
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}
