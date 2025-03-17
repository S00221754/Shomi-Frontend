import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme, Text, Input, Button } from "@rneui/themed";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isLoading } = useAuth();
  const { theme } = useTheme(); // ✅ Use theme for styling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>

      <Text h3 style={{ color: theme.colors.primary, marginBottom: 20 }}>Welcome To Shomi</Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        leftIcon={{ type: "material", name: "email", color: theme.colors.grey3 }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ width: "100%", marginBottom: 10 }}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        leftIcon={{ type: "material", name: "lock", color: theme.colors.grey3 }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ width: "100%", marginBottom: 20 }}
      />

      <Button
        title={'Login'}
        onPress={() => login(email, password)}
        disabled={isLoading}
        loading={isLoading}
        buttonStyle={{
          backgroundColor: isLoading ? theme.colors.grey3 : theme.colors.primary,
          borderRadius: 10,
          paddingVertical: 12,
          width: "100%",
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
      />
    </View>
  );
}
