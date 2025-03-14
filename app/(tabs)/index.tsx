import { Text, View, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Button, useTheme } from "@rneui/themed";
import { useAppTheme } from "@/context/ThemeContext";

export default function Index() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { toggleTheme, isDarkMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.black }]}>Welcome to</Text>
      <Text style={[styles.appName, { color: theme.colors.primary }]}>Shomi</Text>

      {/* Toggle Theme Button */}
      <Button
        title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
        onPress={toggleTheme}
        containerStyle={styles.buttonContainer}
      />
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
