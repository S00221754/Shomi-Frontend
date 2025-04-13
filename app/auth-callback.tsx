import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "expo-router";

// This is the callback screen for authentication. It handles the redirect after login.
export default function AuthCallback() {
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
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
