import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Icon, Input, useTheme, Text } from "@rneui/themed";
import ShomiTentapEditor, {
  ShomiTentapEditorRef,
} from "@/components/common/ShomiTentapEditor";
import { Formik } from "formik";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import IngredientRow from "@/components/Ingredients/IngredientRow";
import RecipeIngredientModal from "@/components/modals/RecipeIngredientModal";
import { SelectedIngredient } from "@/Interfaces/ingredient";
import { useAuth } from "@/providers/AuthProvider";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
} from "@/services/recipe.Service";
import { uploadRecipeImage } from "@/lib/supabase/uploadRecipeImage";
import { RecipeDTO } from "@/Interfaces/recipe";
import { useToast } from "@/utils/toast";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { recipeValidationSchema } from "@/validation/RecipeSchema";
import { ActivityIndicator } from "react-native-paper";
import { deleteRecipeImage } from "@/lib/supabase/deleteRecipeImage";
import ShomiButton from "@/components/common/ShomiButton";

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "").trim();

const RecipeFormScreen = () => {
  const { theme } = useTheme();
  const { userId } = useAuth();
  const { id } = useLocalSearchParams();
  const isEdit = !!id;
  const router = useRouter();
  const textColor =
    theme.mode === "dark" ? theme.colors.white : theme.colors.black;
  const { showToast } = useToast();

  const [images, setImages] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<
    SelectedIngredient | undefined
  >(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [formValues, setFormValues] = useState<typeof initialValues | null>(
    null
  );
  const [originalImages, setOriginalImages] = useState<string[]>([]);

  const editorRef = useRef<ShomiTentapEditorRef>(null);

  const initialValues = {
    recipe_name: "",
    recipe_description: "",
    recipe_instructions: "",
    cooking_time: "",
    ingredients: [] as SelectedIngredient[],
  };

  useFocusEffect(
    useCallback(() => {
      const loadRecipe = async () => {
        if (!isEdit) {
          setFormValues(initialValues);
          return;
        }

        try {
          const data = await getRecipeById(id as string);
          setImages(data.recipe_images ?? []);
          setOriginalImages(data.recipe_images ?? []);
          setFormValues({
            recipe_name: data.recipe_name,
            recipe_description: data.recipe_description,
            recipe_instructions: data.recipe_instructions,
            cooking_time: data.cooking_time.toString(),
            ingredients: data.ingredients,
          });
        } catch (err) {
          showToast("error", "Failed to load recipe for editing.");
        }
      };

      loadRecipe();
    }, [id])
  );

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

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  if (!formValues) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Formik
        initialValues={formValues}
        validationSchema={recipeValidationSchema}
        enableReinitialize
        validateOnMount
        onSubmit={async (values) => {
          if (
            values.ingredients.length < 3 ||
            stripHtml(values.recipe_instructions).length === 0
          ) {
            showToast(
              "error",
              "Please provide at least 3 ingredients and valid instructions"
            );
            return;
          }

          try {
            setSubmitting(true);
            const uploadedImages: string[] = [];
            for (const uri of images) {
              if (uri.startsWith("http")) uploadedImages.push(uri);
              else uploadedImages.push(await uploadRecipeImage(uri));
            }

            const payload: RecipeDTO = {
              ...values,
              cooking_time: parseInt(values.cooking_time, 10),
              author_id: userId!,
              recipe_images: uploadedImages,
            };

            if (isEdit) {
              await updateRecipe(id as string, payload);

              const removedImages = originalImages.filter(
                (img) => !uploadedImages.includes(img)
              );

              for (const url of removedImages) {
                await deleteRecipeImage(url);
              }
            } else {
              await createRecipe(payload);
            }

            showToast(
              "success",
              isEdit ? "Recipe Updated" : "Recipe Published"
            );

            router.back();
          } catch (err) {
            console.error(err);
            showToast("error", "Something went wrong");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
            <ShomiButton
              title={`Select Images (${images.length}/3)`}
              onPress={pickImage}
              disabled={images.length >= 3}
              containerStyle={{ marginBottom: 20 }}
              color={theme.colors.secondary}
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
              labelStyle={{
                fontWeight: "bold",
                fontSize: 18,
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              value={values.recipe_name}
              onChangeText={handleChange("recipe_name")}
              onBlur={handleBlur("recipe_name")}
              placeholder="e.g. Classic Spaghetti Bolognese"
              errorMessage={
                touched.recipe_name && errors.recipe_name
                  ? errors.recipe_name
                  : undefined
              }
              inputStyle={{
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              placeholderTextColor={
                theme.mode === "dark" ? theme.colors.grey2 : theme.colors.grey3
              }
            />

            <Input
              label="Short Description"
              labelStyle={{
                fontWeight: "bold",
                fontSize: 18,
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              value={values.recipe_description}
              onChangeText={handleChange("recipe_description")}
              onBlur={handleBlur("recipe_description")}
              placeholder="A quick hearty pasta dish with meat sauce."
              errorMessage={
                touched.recipe_description && errors.recipe_description
                  ? errors.recipe_description
                  : undefined
              }
              inputStyle={{
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              placeholderTextColor={
                theme.mode === "dark" ? theme.colors.grey2 : theme.colors.grey3
              }
            />

            <View style={{ paddingHorizontal: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color:
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black,
                  marginBottom: 4,
                }}
              >
                Ingredients
              </Text>

              {values.ingredients.map((item, index) => (
                <IngredientRow
                  key={index}
                  ingredient={item}
                  onRemove={() =>
                    setFieldValue(
                      "ingredients",
                      values.ingredients.filter((_, i) => i !== index)
                    )
                  }
                  onPress={() => {
                    setSelectedIngredient(item);
                    setShowIngredientModal(true);
                  }}
                />
              ))}

              <ShomiButton
                title="Add Ingredients"
                onPress={() => setShowIngredientModal(true)}
                containerStyle={{ marginBottom: 20 }}
                color={theme.colors.secondary}
              />

              {touched.ingredients &&
                typeof errors.ingredients === "string" && (
                  <Text style={{ color: theme.colors.error, marginBottom: 5 }}>
                    {errors.ingredients}
                  </Text>
                )}
            </View>

            <View style={{ paddingHorizontal: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color:
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black,
                  marginBottom: 4,
                }}
              >
                Instructions
              </Text>

              <ShomiTentapEditor
                ref={editorRef}
                initialValue={formValues.recipe_instructions}
                onChange={(val) => setFieldValue("recipe_instructions", val)}
              />

              {touched.recipe_instructions && errors.recipe_instructions && (
                <Text style={{ color: theme.colors.error, marginBottom: 5 }}>
                  {errors.recipe_instructions}
                </Text>
              )}
            </View>

            {stripHtml(values.recipe_instructions).length > 0 && (
              <Button
                title="Clear Instructions"
                onPress={() => {
                  setFieldValue("recipe_instructions", "");
                  editorRef.current?.clear?.();
                }}
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
              labelStyle={{
                fontWeight: "bold",
                fontSize: 18,
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              value={values.cooking_time}
              onChangeText={handleChange("cooking_time")}
              onBlur={handleBlur("cooking_time")}
              keyboardType="numeric"
              errorMessage={
                touched.cooking_time && errors.cooking_time
                  ? errors.cooking_time
                  : undefined
              }
              inputStyle={{
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              placeholderTextColor={
                theme.mode === "dark" ? theme.colors.grey2 : theme.colors.grey3
              }
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
                const existingIndex = values.ingredients.findIndex(
                  (item) => item.ingredient_id === newIngredient.ingredient_id
                );

                const updatedIngredients = [...values.ingredients];
                if (existingIndex !== -1) {
                  updatedIngredients[existingIndex] = newIngredient;
                } else {
                  updatedIngredients.push(newIngredient);
                }

                setFieldValue("ingredients", updatedIngredients);
                setSelectedIngredient(undefined);
                setShowIngredientModal(false);
              }}
              initialData={selectedIngredient}
            />

            <Button
              title={isEdit ? "Update Recipe" : "Publish Recipe"}
              onPress={handleSubmit as any}
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
              disabled={submitting}
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default RecipeFormScreen;
