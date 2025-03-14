import { AuthProvider } from "@/context/AuthContext";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="recipes/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#25292e" },
              headerTintColor: "#ffd33d",
              headerShadowVisible: false,
              headerTitle: "",
            }}
          />
          <Stack.Screen
            name="recipes/recommendedRecipesScreen"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: "#25292e" },
              headerTintColor: "#ffd33d",
              headerShadowVisible: false,
              headerTitle: "",
            }}
          />
        </Stack>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}
