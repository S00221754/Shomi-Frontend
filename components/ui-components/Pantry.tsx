import React from "react";
import { Modal, View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useGetIngredient } from "@/hooks/useGetIngredient";
import { ProductInfo } from "@/types/ingredient";

const Pantry: React.FC = () => {
    const { ingredients, loading } = useGetIngredient();

    return (
        <View style={styles.container}>
          <Text style={styles.title}>My Pantry</Text>
    
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={ingredients}
              keyExtractor={(item: ProductInfo) => (item.Ing_id ? item.Ing_id.toString() : "unknown")}
              renderItem={({ item }) => (
                <View style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>Product: {item.Ing_name}</Text>
                  <Text style={styles.ingredientText}>Brand: {item.Ing_brand || "Unknown"}</Text>
                  <Text style={styles.ingredientText}>Quantity: {item.Ing_keywords || "N/A"}</Text>
                </View>
              )}
            />
          )}
        </View>
      );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
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
  });

  export default Pantry;