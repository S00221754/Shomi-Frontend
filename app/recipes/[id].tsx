import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getRecipeById } from "../../services/recipe.Service";
import { Recipe } from "../../types/recipe";
import { Text, Button, Card, Divider } from "@rneui/themed";
import { useTheme } from "@rneui/themed";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id as string);
        setRecipe(data);
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
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, color: theme.colors.error, textAlign: "center" }}>
          {error || "Recipe not found"}
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8, marginTop: 20 }}
          titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
    >
      <Text h2 style={{ fontSize: 28, fontWeight: "bold", color: theme.colors.primary, marginBottom: 15 }}>
        {recipe.recipe_name}
      </Text>

      <Card containerStyle={{ backgroundColor: theme.colors.white, borderRadius: 10, padding: 20 }}>
        <Card.Title style={{ fontSize: 20, fontWeight: "bold", color: theme.colors.black, textAlign: "center" }}>
          Recipe Details
        </Card.Title>
        <Divider style={{ marginBottom: 10 }} />

        <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black, marginTop: 10 }}>
          Description
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.grey3, marginTop: 5 }}>
          {recipe.recipe_description}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black, marginTop: 15 }}>
          Cooking Time
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.primary, marginTop: 5 }}>
          ⏱ {recipe.cooking_time} minutes
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black, marginTop: 15 }}>
          Ingredients
        </Text>
        <Divider style={{ marginVertical: 5 }} />
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={{ fontSize: 16, color: theme.colors.black, marginVertical: 3 }}>
            • {ingredient.quantity} {ingredient.unit} {ingredient.ingredient_name}
          </Text>
        ))}

        <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black, marginTop: 15 }}>
          Instructions
        </Text>
        <Divider style={{ marginVertical: 5 }} />
        <Text style={{ fontSize: 16, color: theme.colors.black, marginTop: 5 }}>
          {recipe.recipe_instructions}
        </Text>
      </Card>

      <Button
        title="Go Back"
        onPress={() => router.back()}
        buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8, marginTop: 20 }}
        titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
      />
    </ScrollView>
  );
}
