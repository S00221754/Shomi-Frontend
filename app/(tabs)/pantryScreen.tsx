import Pantry from '@/components/pantry/Pantry';
import { Text, View, StyleSheet } from 'react-native';

export default function PantryScreen() {
  return (
    <View style={styles.container}>
      <Pantry/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  text: {
    color: '#fff',
  },
});
