import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  Pressable,
} from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  useNavigation,
  useFocusEffect,
} from "expo-router";
import { getRecipeById } from "../../services/recipe.Service";
import { Recipe } from "../../types/recipe";
import { Text, Button, Divider, Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import ImageCarousel from "@/components/Recipe/ImageCarousel";
import { htmlParser } from "@/utils/htmlparser";
import { useAuth } from "@/providers/AuthProvider";
import ShomiButton from "@/components/common/ShomiButton";
import { addBookmark, removeBookmark } from "@/services/bookmarkRecipeService";
import { showToast } from "@/utils/toast";

export default function RecipeDetails() {
  const { id, bookmarked } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { userId } = useAuth();
  const navigation = useNavigation();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    bookmarked === "true"
  );

  useFocusEffect(
    useCallback(() => {
      setIsBookmarked(bookmarked === "true");
    }, [bookmarked])
  );

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

  useLayoutEffect(() => {
    if (recipe) {
      navigation.setOptions({
        headerTitle: recipe.recipe_name,
      });
    }
  }, [recipe, userId, navigation, theme]);

  const toggleBookmark = async () => {
    if (!recipe) return;

    try {
      if (isBookmarked) {
        await removeBookmark(userId!, recipe.recipe_id);
        setIsBookmarked(false);
      } else {
        await addBookmark(userId!, recipe.recipe_id);
        setIsBookmarked(true);
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

  if (error || !recipe) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: theme.colors.error,
            textAlign: "center",
          }}
        >
          {error || "Recipe not found"}
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            marginTop: 20,
          }}
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
      {/* Image Carousel */}
      {recipe.recipe_images && recipe.recipe_images.length > 0 && (
        <ImageCarousel images={recipe.recipe_images} width={width} />
      )}

      {/* Recipe Description */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.black,
            marginTop: 10,
          }}
        >
          Description
        </Text>
        <Text style={{ fontSize: 16, color: theme.colors.grey3, marginTop: 5 }}>
          {recipe.recipe_description}
        </Text>
      </View>

      {/* Cooking Time */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.black,
            marginTop: 15,
          }}
        >
          Cooking Time
        </Text>
        <Text
          style={{ fontSize: 16, color: theme.colors.primary, marginTop: 5 }}
        >
          ⏱ {recipe.cooking_time} minutes
        </Text>
      </View>

      {/* Ingredients */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.black,
            marginTop: 15,
          }}
        >
          Ingredients
        </Text>
        <Divider style={{ marginVertical: 5 }} />
        {recipe.ingredients.map((ingredient, index) => (
          <Text
            key={index}
            style={{
              fontSize: 16,
              color: theme.colors.black,
              marginVertical: 3,
            }}
          >
            • {ingredient.quantity} {ingredient.unit}{" "}
            {ingredient.ingredient_name}
          </Text>
        ))}
      </View>

      {/* Instructions */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.black,
            marginTop: 15,
          }}
        >
          Instructions
        </Text>
        <Divider style={{ marginVertical: 5 }} />
        {recipe && (
          <>
            {htmlParser(recipe.recipe_instructions).map((step, idx) => (
              <Text key={idx}>
                {idx + 1}. {step}
              </Text>
            ))}
          </>
        )}
      </View>

      <View style={{ marginBottom: 10 }}>
        {recipe.author?.id === userId && (
          <ShomiButton
            title="Edit Recipe"
            icon="pencil"
            color={theme.colors.warning}
            onPress={() =>
              router.push({
                pathname: "/recipes/recipeFormScreen",
                params: { id: recipe.recipe_id },
              })
            }
          />
        )}
      </View>

      {/* Bookmark Recipe Button */}
      <ShomiButton
        title={isBookmarked ? "Remove Bookmark" : "Bookmark Recipe"}
        icon={isBookmarked ? "bookmark" : "bookmark-outline"}
        color={theme.colors.primary}
        onPress={toggleBookmark}
      />
    </ScrollView>
  );
}
