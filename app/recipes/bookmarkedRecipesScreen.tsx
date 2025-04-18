import React, { useCallback, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Button, Icon, useTheme } from "@rneui/themed";
import { useFocusEffect, useRouter } from "expo-router";
import { Recipe } from "@/Interfaces/recipe";
import { useAuth } from "@/providers/AuthProvider";
import {
  getBookmarkRecipes,
  removeBookmark,
} from "@/services/bookmarkRecipeService";
import { useToast } from "@/utils/toast";
import ShomiButton from "@/components/common/ShomiButton";

export default function BookmarkedRecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const { userId } = useAuth();
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      const fetchBookmarks = async () => {
        try {
          setLoading(true);
          const fetched = await getBookmarkRecipes();
          setRecipes(fetched.map((b: any) => b.recipe));
        } catch (err) {
          setError("Failed to load bookmarked recipes.");
        } finally {
          setLoading(false);
        }
      };

      fetchBookmarks();
    }, [userId])
  );

  const handleRemoveBookmark = async (recipeId: string) => {
    try {
      await removeBookmark(recipeId);
      setRecipes((prev) => prev.filter((r) => r.recipe_id !== recipeId));
      showToast("success", "Bookmark removed");
    } catch {
      showToast("error", "Could not remove bookmark");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
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
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text h4 style={{ color: theme.colors.error }}>
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
              borderRadius: 10,
              padding: 15,
              backgroundColor: theme.colors.white,
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

            <Card.Title style={{ textAlign: "center", fontSize: 18 }}>
              {item.recipe_name}
            </Card.Title>

            <Card.Divider />

            <Text style={{ textAlign: "center", color: theme.colors.grey3 }}>
              {item.recipe_description}
            </Text>

            <Text
              style={{
                textAlign: "center",
                color: theme.colors.primary,
                marginBottom: 10,
              }}
            >
              ⏱ {item.cooking_time} mins
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <ShomiButton
                title="View Recipe"
                onPress={() =>
                  router.push({
                    pathname: `/recipes/[id]`,
                    params: {
                      id: item.recipe_id,
                      bookmarked: "true",
                    },
                  })
                }
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 8,
                  paddingVertical: 10,
                }}
                titleStyle={{ fontWeight: "bold", color: theme.colors.white }}
              />

              <ShomiButton
                icon="bookmark"
                onPress={() => handleRemoveBookmark(item.recipe_id)}
              />
            </View>
          </Card>
        )}
      />
    </View>
  );
}
