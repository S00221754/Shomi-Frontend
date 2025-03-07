import { ProductInfo } from '@/types/ingredient';
import { Modal, View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredient: ProductInfo | null;
    onAddIngredient: (ingredient: ProductInfo, unitInput: string) => Promise<void>;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
    visible,
    onClose,
    ingredient,
    onAddIngredient,
  }) => {
    const [unitInput, setUnitInput] = useState("");
  
    if (!ingredient) return null;
  
    const handleAddClick = async () => {
      if (!unitInput) return;
      await onAddIngredient(ingredient, unitInput);
    };
  
    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Ingredient Details</Text>
            <Text style={styles.subText}>{ingredient.Ing_name}</Text>
            <Text style={styles.subText}>{ingredient.Ing_brand}</Text>
  
            <TextInput
              style={styles.input}
              placeholder="Enter unit (e.g., ml, g)"
              placeholderTextColor="#bbb"
              value={unitInput}
              onChangeText={setUnitInput}
            />
  
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddClick}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: "#333",
      width: "85%",
      padding: 20,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#ffd33d",
      marginBottom: 10,
    },
    subText: {
      fontSize: 16,
      color: "#ccc",
      marginBottom: 10,
    },
    input: {
      width: "100%",
      backgroundColor: "#444", 
      color: "#fff",
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#666",
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 10,
    },
    addButton: {
      flex: 1,
      backgroundColor: "#ffd33d",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginRight: 5,
    },
    closeButton: {
      flex: 1,
      backgroundColor: "#d32f2f",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginLeft: 5,
    },
    buttonText: {
      color: "#25292e",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
  export default IngredientModal;