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
import {
  getRecipeById,
  getRecipeDeductionPreview,
  markRecipeAsCooked,
} from "../../services/recipe.Service";
import {
  DeductionPreview,
  IngredientsToDeduct,
  Recipe,
} from "../../Interfaces/recipe";
import { Text, Button, Divider, Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import ImageCarousel from "@/components/Recipe/ImageCarousel";
import { htmlParser } from "@/utils/htmlparser";
import { useAuth } from "@/providers/AuthProvider";
import ShomiButton from "@/components/common/ShomiButton";
import { addBookmark, removeBookmark } from "@/services/bookmarkRecipeService";
import { showToast } from "@/utils/toast";
import DeductionPreviewModal from "@/components/modals/DeductionPreviewModal";

export default function RecipeDetails() {
  const { id, bookmarked } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { userId } = useAuth();
  const navigation = useNavigation();
  const textColor =
    theme.mode === "dark" ? theme.colors.white : theme.colors.black;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    bookmarked === "true"
  );

  const [deductionMatches, setDeductionMatches] = useState<DeductionPreview[]>(
    []
  );
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchRecipe = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getRecipeById(id as string);
          setRecipe(data);
          setIsBookmarked(bookmarked === "true");
        } catch (err) {
          setError("Failed to load recipe.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecipe();
    }, [id, bookmarked])
  );

  const toggleBookmark = async () => {
    if (!recipe) return;

    try {
      if (isBookmarked) {
        await removeBookmark(recipe.recipe_id);
        setIsBookmarked(false);
      } else {
        await addBookmark(recipe.recipe_id);
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

  const handleCookedPress = async () => {
    if (!userId || !recipe?.recipe_id) return;

    try {
      const data = await getRecipeDeductionPreview(recipe.recipe_id);
      setDeductionMatches(data);
      setIsPreviewVisible(true);
    } catch (err) {
      console.error("Error fetching deduction preview:", err);
      showToast("error", "Failed", "Could not load preview.");
    }
  };

  const handleConfirmedDeductions = async (final: DeductionPreview[]) => {
    setIsPreviewVisible(false);

    const deductions: IngredientsToDeduct[] = final
      .filter((d) => d.matched_user_ingredient !== null)
      .map((d) => ({
        user_ingredient_id: d.matched_user_ingredient!.id,
        recipe_quantity: d.recipe_ingredient.quantity,
        recipe_unit: d.recipe_ingredient.unit,
      }));

    if (!userId || !recipe?.recipe_id) return;

    try {
      const result = await markRecipeAsCooked(recipe.recipe_id, deductions);
      console.log("Cooked result:", result);
      showToast(
        "success",
        "Recipe Cooked",
        `Updated ${result.updated.length} pantry item(s), skipped ${result.skipped.length}`
      );
    } catch (error) {
      console.error("Error applying deduction:", error);
      showToast("error", "Failed", "Could not deduct from pantry.");
    }
  };

  useLayoutEffect(() => {
    if (recipe) {
      navigation.setOptions({
        headerTitle: recipe.recipe_name,
      });
    }
  }, [navigation, recipe]);

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
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 20,
        }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        {recipe.recipe_images && recipe.recipe_images.length > 0 && (
          <ImageCarousel images={recipe.recipe_images} width={width} />
        )}

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: textColor,
              marginTop: 10,
            }}
          >
            Description
          </Text>
          <Text style={{ fontSize: 16, color: textColor, marginTop: 5 }}>
            {recipe.recipe_description}
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: textColor,
              marginTop: 15,
            }}
          >
            Cooking Time
          </Text>
          <Text
            style={{ fontSize: 16, color: theme.colors.primary, marginTop: 5 }}
          >
            {recipe.cooking_time} minutes
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: textColor,
              marginTop: 15,
            }}
          >
            Ingredients
          </Text>
          <Divider style={{ marginVertical: 5 }} />
          {recipe.ingredients.map((ingredient, index) => (
            <Text
              key={index}
              style={{ fontSize: 16, color: textColor, marginVertical: 3 }}
            >
              • {ingredient.quantity} {ingredient.unit}{" "}
              {ingredient.ingredient_name}
            </Text>
          ))}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: textColor,
              marginTop: 15,
            }}
          >
            Instructions
          </Text>
          <Divider style={{ marginVertical: 5 }} />
          {recipe &&
            htmlParser(recipe.recipe_instructions).map((step, idx) => (
              <Text key={idx} style={{ fontSize: 16, color: textColor }}>
                {idx + 1}. {step}
              </Text>
            ))}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {recipe.author?.id === userId && (
            <ShomiButton
              title="Edit"
              icon="pencil"
              color={theme.colors.warning}
              onPress={() =>
                router.push({
                  pathname: "/recipes/recipeFormScreen",
                  params: { id: recipe.recipe_id },
                })
              }
              containerStyle={{ flex: 1 }}
            />
          )}
          <ShomiButton
            title={isBookmarked ? "Unbookmark" : "Bookmark"}
            icon={isBookmarked ? "bookmark" : "bookmark-outline"}
            color={theme.colors.secondary}
            onPress={toggleBookmark}
            containerStyle={{ flex: 1 }}
          />
        </View>

        <ShomiButton
          title="I've Cooked This"
          icon="check-circle"
          color={theme.colors.primary}
          onPress={handleCookedPress}
          buttonStyle={{ marginBottom: 10 }}
        />
      </ScrollView>

      <DeductionPreviewModal
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        data={deductionMatches}
        userId={userId!}
        onConfirm={handleConfirmedDeductions}
      />
    </>
  );
}
