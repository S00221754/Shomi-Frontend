import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getRecommendedRecipes } from "../../services/recipe.Service";
import { Recipe } from "../../Interfaces/recipe";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme, Text, Card, Button } from "@rneui/themed";

export default function RecommendedRecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  

  const selectedIngredients = params.selectedIngredients
    ? JSON.parse(params.selectedIngredients as string)
    : [];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecommendedRecipes(selectedIngredients);
        setRecipes(data);
      } catch (error) {
        console.error("Error Fetching Recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
    >
      {recipes.map((recipe) => (
        <Card
          key={recipe.recipe_id}
          containerStyle={{
            backgroundColor: isDark ? theme.colors.grey0 : theme.colors.white,
            borderRadius: 10,
            padding: 15,
            shadowColor: isDark ? theme.colors.greyOutline : theme.colors.black,
            elevation: 3,
          }}
        >
          {Array.isArray(recipe.recipe_images) &&
            recipe.recipe_images.length > 0 && (
              <Card.Image
                source={{ uri: recipe.recipe_images[0] }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 10,
                  marginBottom: 12,
                }}
                resizeMode="cover"
              />
            )}

          <Card.Title
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDark ? theme.colors.white : theme.colors.black,
              textAlign: "center",
            }}
          >
            {recipe.recipe_name}
          </Card.Title>
          <Card.Divider />
          <Text
            style={{
              fontSize: 14,
              color: isDark ? theme.colors.white : theme.colors.grey3,
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            {recipe.recipe_description}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.primary,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            ⏱ {recipe.cooking_time} mins
          </Text>
          <Button
            title="View Recipe"
            buttonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              paddingVertical: 10,
            }}
            titleStyle={{ fontWeight: "bold", color: theme.colors.white }}
            onPress={() =>
              router.push({
                pathname: `/recipes/[id]`,
                params: { id: recipe.recipe_id },
              })
            }
          />
        </Card>
      ))}
    </ScrollView>
  );
}
