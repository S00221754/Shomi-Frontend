import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* Set the StatusBar style based on the theme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Stack Navigator */}
      <Stack>
        {/* Ensure login is the first page */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        
        {/* Tabs layout (won't load until login is completed) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Not Found Page */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}