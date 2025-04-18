import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Text, useTheme } from "@rneui/themed";
import Logo from "@/components/common/Logo";
import Auth from "@/components/auth/Auth";
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ alignItems: "center", marginTop: 60, marginBottom: 20 }}>
          <Logo width={175} height={175} />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 12,
              color: theme.colors.primary,
            }}
          >
            Welcome to Shomi
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <EmailLoginForm />
          <Auth />

          <Pressable
            onPress={() => router.push("/register")}
            style={{ marginTop: 20, alignItems: "center" }}
          >
            <Text style={{ fontSize: 14, color: theme.colors.grey5, marginTop: 10 }}>
              Don't have an account?{" "}
              <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                Create one
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
