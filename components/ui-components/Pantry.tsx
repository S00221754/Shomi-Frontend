import React, { useCallback, useState } from "react";
import { Modal, View, Text, Button, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
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

  useFocusEffect(
    useCallback(() => {
      fetchUserIngredients();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pantry</Text>

      {userIngredients.length === 0 ? (
        <Text style={styles.emptyText}>No ingredients in your pantry</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Amount</Text>
              <Text style={styles.headerText}>Unit Type</Text>
              <Text style={styles.headerText}>Expiry Date</Text>
              <Text style={styles.headerText}>Action</Text>
            </View>

            {/* Table Rows */}
            {userIngredients.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.cellText}>{item.ingredient.Ing_name}</Text>
                <Text style={styles.cellText}>{item.totalAmount || "Unknown"}</Text>
                <Text style={styles.cellText}>{item.unitType || "N/A"}</Text>
                <Text style={styles.cellText}>{item.expiryDate || "N/A"}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item.id)}>
                  <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

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
    backgroundColor: "#25292e",
    padding: 20,
  },
  tableContainer: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginTop: 5,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffd33d",
    textAlign: "center",
  },
  cellText: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
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