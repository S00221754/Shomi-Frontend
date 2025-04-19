import Pantry from "@/components/pantry/Pantry";
import { View, StyleSheet } from "react-native";

// The pantry screen component is the main screen of the application
export default function PantryScreen() {
  return (
    <View style={styles.container}>
      <Pantry />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
});
