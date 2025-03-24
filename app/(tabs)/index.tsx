import { Text, View, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Button, useTheme } from "@rneui/themed";

export default function Index() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const textColor = theme.mode === "dark" ? "white" : "black";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: textColor }]}>Welcome to</Text>
      <Text style={[styles.appName, { color: theme.colors.primary }]}>Shomi</Text>
      {/* Logout Button */}
      <Button title="Logout" onPress={logout} containerStyle={styles.buttonContainer} buttonStyle={{ backgroundColor: theme.colors.error }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 10,
    width: 200,
  },
});
