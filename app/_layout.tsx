import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {

  const colorScheme = useColorScheme();
  console.log(colorScheme);
  
  return (
    <>
      {/* Set the StatusBar style based on the theme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Stack Navigator */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}