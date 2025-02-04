import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
export default function Index() {

  const { logout } = useAuth();

  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Shomi</Text>
      <Button title="Logout" onPress={logout} />
    </View>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
