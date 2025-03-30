import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Button,
  Icon,
  Input,
  useTheme,
  Text,
  Card,
  Divider,
} from "@rneui/themed";
import ShomiTentapEditor, {
  ShomiTentapEditorRef,
} from "@/components/common/ShomiTentapEditor";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import IngredientRow from "@/components/Ingredients/IngredientRow";
import RecipeIngredientModal from "@/components/modals/RecipeIngredientModal";
import { SelectedIngredient } from "@/types/ingredient";
import { useAuth } from "@/providers/AuthProvider";
import { createRecipe } from "@/services/recipe.Service";
import { uploadRecipeImage } from "@/lib/supabase/uploadRecipeImage";
import { RecipeDTO } from "@/types/recipe";
import { showToast } from "@/utils/toast";

// helper function for clear instructions
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "").trim();

const RecipeFormScreen = () => {
  const { theme } = useTheme();
  const { userId } = useAuth();

  const [images, setImages] = useState<string[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [selectedIngredient, setSelectedIngredient] = useState<
    SelectedIngredient | undefined
  >(undefined);
  const [submitting, setSubmitting] = useState(false);

  const [showIngredientModal, setShowIngredientModal] = useState(false);

  const editorRef = useRef<ShomiTentapEditorRef>(null);

  const pickImage = async () => {
    if (images.length >= 3) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: 3 - images.length,
      quality: 0.6,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...uris]);
    }
  };

  const removeIngredient = (index: number) => {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handlePublish = async () => {
    if (
      !recipeName ||
      !description ||
      !instructions ||
      !cookingTime ||
      !userId
    ) {
      showToast(
        "error",
        "Missing Fields",
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setSubmitting(true);
      const imageUrls: string[] = [];

      for (const uri of images) {
        const imageUrl = await uploadRecipeImage(uri);
        imageUrls.push(imageUrl);
      }

      const payload: RecipeDTO = {
        recipe_name: recipeName,
        recipe_description: description,
        ingredients: recipeIngredients,
        recipe_instructions: instructions,
        cooking_time: parseInt(cookingTime, 10),
        author_id: userId,
        recipe_images: imageUrls,
      };

      await createRecipe(payload);

      showToast(
        "success",
        "Recipe Published",
        "Your recipe has been published!"
      );

      // Optionally reset form fields here
    } catch (err) {
      console.error("Publish error:", err);
      showToast("error", "Publish Failed", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
        }}
      >
        <Button
          title={`Select Images (${images.length}/3)`}
          onPress={pickImage}
          disabled={images.length >= 3}
          containerStyle={{ marginBottom: 20 }}
          buttonStyle={{
            backgroundColor: theme.colors.grey2,
            borderRadius: 10,
            paddingVertical: 12,
          }}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {images.map((uri, index) => (
            <View key={index} style={{ position: "relative" }}>
              <Image
                source={{ uri }}
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  backgroundColor: "black",
                  borderRadius: 12,
                  padding: 2,
                  zIndex: 10,
                }}
                onPress={() => removeImage(index)}
              >
                <Icon name="close" type="material" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Input
          label="Recipe Name"
          labelStyle={{ fontWeight: "bold", fontSize: 18 }}
          value={recipeName}
          onChangeText={setRecipeName}
          maxLength={100}
          placeholder="e.g. Classic Spaghetti Bolognese"
        />

        <Input
          label="Short Description"
          labelStyle={{ fontWeight: "bold", fontSize: 18 }}
          value={description}
          onChangeText={setDescription}
          maxLength={150}
          multiline
          placeholder="A quick hearty pasta dish with meat sauce."
        />

        <View style={{ paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.grey3,
              marginBottom: 4,
            }}
          >
            Ingredients
          </Text>

          {recipeIngredients.map((item, index) => (
            <IngredientRow
              key={index}
              ingredient={item}
              onRemove={() => removeIngredient(index)}
              onPress={() => {
                setSelectedIngredient(item);
                setShowIngredientModal(true);
              }}
            />
          ))}

          <Button
            title="Add Ingredients"
            onPress={() => setShowIngredientModal(true)}
            containerStyle={{ marginBottom: 20 }}
            buttonStyle={{
              backgroundColor: theme.colors.grey2,
              borderRadius: 10,
              paddingVertical: 12,
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.grey3,
              marginBottom: 4,
            }}
          >
            Instructions
          </Text>
          <ShomiTentapEditor
            ref={editorRef}
            initialValue={instructions}
            onChange={(val) => setInstructions(val)}
          />
        </View>

        {stripHtml(instructions).length > 0 && (
          <Button
            title="Clear Instructions"
            onPress={() => setShowClearConfirm(true)}
            type="solid"
            buttonStyle={{
              marginVertical: 12,
              backgroundColor: theme.colors.error,
              borderRadius: 8,
            }}
            titleStyle={{ color: "white", fontWeight: "bold" }}
            icon={{ name: "delete", color: "white" }}
            iconRight
          />
        )}

        <Input
          label="Cooking Time (mins)"
          value={cookingTime}
          onChangeText={setCookingTime}
          keyboardType="numeric"
        />

        <ConfirmationModal
          visible={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={() => {
            setInstructions("");
            editorRef.current?.clear?.();
            setShowClearConfirm(false);
          }}
          message="Are you sure you want to clear all instructions?"
        />

        <RecipeIngredientModal
          visible={showIngredientModal}
          onClose={() => setShowIngredientModal(false)}
          onSave={(newIngredient) => {
            setRecipeIngredients((prev) => {
              const existingIndex = prev.findIndex(
                (item) => item.ingredient_id === newIngredient.ingredient_id
              );
              if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newIngredient;
                return updated;
              } else {
                return [...prev, newIngredient];
              }
            });
            setSelectedIngredient(undefined);
            setShowIngredientModal(false);
          }}
          initialData={selectedIngredient}
        />

        <Button
          title="Publish Recipe"
          onPress={handlePublish}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 10,
            paddingVertical: 12,
          }}
          titleStyle={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.white,
          }}
          containerStyle={{
            marginTop: 20,
            marginBottom: 40,
            paddingHorizontal: 10,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default RecipeFormScreen;
