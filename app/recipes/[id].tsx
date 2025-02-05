import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getRecipeById } from "../../services/recipe.Service";
import { Recipe } from "../../types/recipe";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id as string);
        setRecipe(data);
        console.log(data);

      } catch (err) {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

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
        <Text onPress={() => router.back()} style={styles.backButton}>
          Go Back
        </Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recipe not found</Text>
        <Text onPress={() => router.back()} style={styles.backButton}>
          Go Back
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.recipe_name}</Text>

      <Text style={styles.subtitle}>Description</Text>
      <Text style={styles.description}>{recipe.recipe_description}</Text>

      <Text style={styles.subtitle}>Cooking Time</Text>
      <Text style={styles.detail}>⏱ {recipe.cooking_time} minutes</Text>

      <Text style={styles.subtitle}>Ingredients</Text>
      <View style={styles.ingredientsContainer}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            • {ingredient.quantity} {ingredient.unit} {ingredient.ingredient_name}
          </Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Instructions</Text>
      <Text style={styles.detail}>{recipe.recipe_instructions}</Text>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  backButton: {
    fontSize: 16,
    color: "#ffd33d",
    textAlign: "center",
    marginTop: 20,
  },
  ingredientsContainer: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
});
