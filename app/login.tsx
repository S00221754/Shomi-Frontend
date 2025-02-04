import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>Login</Text>

      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={() => login(email, password)} />
      )}
    </View>
  );
}
