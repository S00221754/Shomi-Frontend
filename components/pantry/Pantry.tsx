import React, { useCallback, useState } from "react";
import { Modal, View, Text, Button, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, ScrollView, Pressable, Animated } from "react-native";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect, useRouter } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Pantry: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userIngredients, loading, fetchUserIngredients } = useGetUserIngredients(user?.uid || "");
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

  const handleDeletePress = (id: string) => {
    setSelectedIngredientId(id);
    setModalVisible(true);
  };

  const toggleIngredientSelection = (ingredientId: string, isChecked: boolean) => {
    setSelectedIngredients(prev =>
      isChecked ? [...prev, ingredientId] : prev.filter(id => id !== ingredientId)
    );
  };

  const toggleRowExpansion = (ingredientId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const selectedIngIds = userIngredients
            .filter((item) => selectedIngredients.includes(item.id))
            .map((item) => item.ingredient.Ing_id.toString());
          router.push({
            pathname: "/recipes/recommendedRecipesScreen",
            params: { selectedIngredients: JSON.stringify(selectedIngIds) },
          });
        }}
      >
        <Text>Recommend Recipes</Text>
      </TouchableOpacity>

      {userIngredients.length === 0 ? (
        <Text style={styles.emptyText}>No ingredients in your pantry</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Select</Text>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Amount</Text>
            </View>
            {userIngredients.map((item) => (
              <View key={item.id}>
                <TouchableOpacity key={item.id} onPress={() => toggleRowExpansion(item.id)}>
                  <View style={styles.tableRow}>
                    <View style={styles.cellCheck}>
                      <BouncyCheckbox
                        isChecked={selectedIngredients.includes(item.id)}
                        onPress={(isChecked: boolean) => toggleIngredientSelection(item.id, isChecked)}
                        fillColor="#ffd33d"
                        unFillColor="#FFFFFF"

                      />
                    </View>
                    <Text style={styles.cellText}>{item.ingredient.Ing_name}</Text>
                    <Text style={styles.cellText}>{item.totalAmount || "Unknown"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedRows[item.id] && (
                  <Animated.View style={styles.expandedRow}>
                    <Text style={styles.expandedText}>Unit Type: {item.unitType || "N/A"}</Text>
                    <Text style={styles.expandedText}>Expiry Date: {item.expiryDate || "N/A"}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => console.log("Edit Later")}>
                      <Text style={styles.editButtonText}>Edit for Later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item.id)}>
                      <Text style={styles.deleteButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
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
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedRow: {
    backgroundColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 5,
    alignItems: "center",
  },
  checkboxContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
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
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
  },
  cellCheck: {
    flex: 1,
    color: "#fff",
  },
  expandedText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffd33d",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
  },
  editButton: {
    backgroundColor: "blue",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: "80%",
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
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