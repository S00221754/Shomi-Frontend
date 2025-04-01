import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "expo-router";

export default function AuthCallback() {
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
    // Wait for session to be handled in the background
    if (!isLoading) {
      router.replace("/(tabs)");
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
