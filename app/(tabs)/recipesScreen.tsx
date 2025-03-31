import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import axiosInstance from "../../services/api";
import { Recipe } from "../../types/recipe";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";
import ShomiFAB from "@/components/common/ShomiFAB";

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const fetchRecipes = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get<Recipe[]>("/recipes");
          setRecipes(response.data);
        } catch (err) {
          setError("Failed to load recipes.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }, [])
  );

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

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: theme.colors.error,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}
    >
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.recipe_id}
        renderItem={({ item }) => (
          <Card
            containerStyle={{
              backgroundColor: theme.colors.white,
              borderRadius: 10,
              padding: 15,
              shadowColor: theme.colors.black,
              elevation: 3,
            }}
          >
            {Array.isArray(item.recipe_images) &&
              item.recipe_images.length > 0 && (
                <Card.Image
                  source={{ uri: item.recipe_images[0] }}
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
                color: theme.colors.black,
                textAlign: "center",
              }}
            >
              {item.recipe_name}
            </Card.Title>

            <Card.Divider />

            <Text
              style={{
                fontSize: 14,
                color: theme.colors.grey3,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              {item.recipe_description}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: theme.colors.primary,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              ⏱ {item.cooking_time} mins
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
                  params: { id: item.recipe_id },
                })
              }
            />
          </Card>
        )}
      />
      <ShomiFAB
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        actions={[
          {
            icon: "plus",
            label: "Add New Recipe",
            onPress: () =>
              router.push({ pathname: "/recipes/recipeFormScreen" }),
          },
          {
            icon: "magnify",
            label: "Use Pantry Recipe Search",
            onPress: () =>
              router.push({ pathname: "/recipes/recommendedRecipesScreen" }),
          },
          {
            icon: "bookmark",
            label: "View Bookmarked Recipes",
            onPress: () => console.log("View Bookmarked Recipes"),
          },
        ]}
      />
    </View>
  );
}
