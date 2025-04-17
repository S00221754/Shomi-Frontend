import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import { Recipe } from "../../Interfaces/recipe";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";
import ShomiFAB from "@/components/common/ShomiFAB";
import { useAuth } from "@/providers/AuthProvider";
import {
  getBookmarkRecipes,
  addBookmark,
  removeBookmark,
} from "@/services/bookmarkRecipeService";
import { getRecipes } from "@/services/recipe.Service";
import ShomiButton from "@/components/common/ShomiButton";
import { showToast } from "@/utils/toast";

// This is the main screen of the app that displays a list of recipes
export default function RecipeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { userId } = useAuth();

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const [recipesRes, bookmarkedRecipes] = await Promise.all([
            getRecipes(),
            getBookmarkRecipes(),
          ]);

          setRecipes(recipesRes);

          const ids = new Set(bookmarkedRecipes.map((r) => r.recipe_id));
          setBookmarkedIds(ids);
        } catch (err) {
          console.error("Error fetching recipes or bookmarks", err);
          setError("Failed to load recipes.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [userId])
  );

  const toggleBookmark = async (recipeId: string) => {
    const isBookmarked = bookmarkedIds.has(recipeId);

    try {
      if (isBookmarked) {
        await removeBookmark(recipeId);
        setBookmarkedIds((prev) => {
          const updated = new Set(prev);
          updated.delete(recipeId);
          return updated;
        });
      } else {
        await addBookmark(recipeId);
        setBookmarkedIds((prev) => new Set(prev).add(recipeId));
      }
      showToast(
        "success",
        "Bookmark Updated",
        isBookmarked ? "Removed" : "Added"
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

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
              {item.cooking_time} mins
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <ShomiButton
                title="View Recipe"
                onPress={() =>
                  router.push({
                    pathname: `/recipes/[id]`,
                    params: {
                      id: item.recipe_id,
                      bookmarked: bookmarkedIds.has(item.recipe_id).toString(),
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
                icon={
                  bookmarkedIds.has(item.recipe_id)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                onPress={() => toggleBookmark(item.recipe_id)}
              />
            </View>
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
            onPress: () => router.push("/recipes/bookmarkedRecipesScreen"),
          },
        ]}
      />
    </View>
  );
}
