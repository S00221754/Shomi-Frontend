import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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


      </Stack>
    </AuthProvider>
  )
}