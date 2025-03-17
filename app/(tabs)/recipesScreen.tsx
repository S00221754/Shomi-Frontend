import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import axiosInstance from "../../services/api";
import { Recipe } from "../../types/recipe";
import { useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

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
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: theme.colors.error, textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => (
          <Card containerStyle={{ backgroundColor: theme.colors.white, borderRadius: 10, padding: 15, shadowColor: theme.colors.black, elevation: 3 }}>
            <Card.Title style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black, textAlign: "center" }}>
              {item.recipe_name}
            </Card.Title>
            <Card.Divider />
            <Text style={{ fontSize: 14, color: theme.colors.grey3, textAlign: "center", marginBottom: 5 }}>
              {item.recipe_description}
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.primary, textAlign: "center", marginBottom: 10 }}>
              ⏱ {item.cooking_time} mins
            </Text>
            <Button
              title="View Recipe"
              buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8, paddingVertical: 10 }}
              titleStyle={{ fontWeight: "bold", color: theme.colors.white }}
              onPress={() => router.push({ pathname: `/recipes/[id]`, params: { id: item.recipe_id } })}
            />
          </Card>
        )}
      />
    </View>
  );
}
