import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axiosInstance from "../../services/api";
import { Recipe } from "../../types/recipe";

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get<Recipe[]>("/recipes");
        setRecipes(response.data);
      } catch (err) {
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.recipe_name}</Text>
            <Text style={styles.recipeDescription}>{item.recipe_description}</Text>
            <Text style={styles.recipeTime}>⏱ {item.cooking_time} mins</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 15,
  },
  recipeCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
  recipeTime: {
    fontSize: 14,
    color: "#ffd33d",
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

