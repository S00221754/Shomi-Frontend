import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Icon, Input, useTheme } from "@rneui/themed";
import ShomiTentapEditor, {
  ShomiTentapEditorRef,
} from "@/components/common/ShomiTentapEditor";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

type SelectedIngredient = {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "").trim();

const RecipeFormScreen = () => {
  const { theme } = useTheme();

  const [images, setImages] = useState<string[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ref is related to the reset functionality of the editor
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

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        title={`Pick Image (${images.length}/3)`}
        onPress={pickImage}
        disabled={images.length >= 3}
        containerStyle={styles.buttonContainer}
      />

      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Icon name="close" type="material" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Input
        label="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
        maxLength={100}
        placeholder="e.g. Classic Spaghetti Bolognese"
      />

      <Input
        label="Short Description"
        value={description}
        onChangeText={setDescription}
        maxLength={150}
        multiline
        placeholder="A quick hearty pasta dish with meat sauce."
      />

      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Instructions</Text>

      <ShomiTentapEditor
        ref={editorRef}
        initialValue={instructions}
        onChange={(val) => setInstructions(val)}
      />

      {stripHtml(instructions).length > 0 && (
        <Button
          title="Clear Instructions"
          onPress={() => setShowClearConfirm(true)}
          type="solid"
          buttonStyle={{
            marginBottom: 8,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    width: "100%",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "black",
    borderRadius: 12,
    padding: 2,
    zIndex: 10,
  },
});

export default RecipeFormScreen;
