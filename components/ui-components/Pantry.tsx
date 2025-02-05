import React, { useCallback, useState } from "react";
import { Modal, View, Text, Button, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect } from "expo-router";

const Pantry: React.FC = () => {
  const { userId } = useAuth();
  const { userIngredients, loading, fetchUserIngredients } = useGetUserIngredients(userId || "");
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);

  const handleDeletePress = (id: string) => {
    setSelectedIngredientId(id);
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIngredientId) {
      await handleDeleteUserIngredient(selectedIngredientId);
      setModalVisible(false);
      fetchUserIngredients();
    }
  };


  // temp solution for demo purposes - to be replaced with a proper solution
  useFocusEffect(
    useCallback(() => {
        fetchUserIngredients();
    }, [])
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pantry</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userIngredients.length === 0 ? ( // Check if the list is empty
        <Text style={styles.emptyText}>No ingredients in your pantry</Text>
      ) : (
        <FlatList
          data={userIngredients}
          keyExtractor={(item) => item.id || "unknown"}
          renderItem={({ item }) => (
            <View style={styles.ingredientItem}>
              <Text style={styles.ingredientText}>Product: {item.ingredient.Ing_name}</Text>
              <Text style={styles.ingredientText}>Amount: {item.totalAmount || "Unknown"}</Text>
              <Text style={styles.ingredientText}>Quantity: {item.unitQuantity || "N/A"}</Text>
              <Text style={styles.ingredientText}>Unit Type: {item.unitType || "N/A"}</Text>
              <Text style={styles.ingredientText}>Expiry Date: {item.expiryDate || "N/A"}</Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePress(item.id)}
              >
                <Text style={styles.deleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}


      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to remove this ingredient?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  ingredientItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  ingredientText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "white",
  },
  
});

export default Pantry;