import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Overlay, Text, Button, useTheme } from "@rneui/themed";
import { DeductionPreview } from "@/Interfaces/recipe";
import { UserIngredient } from "@/Interfaces/ingredient";
import BottomSheetSelect from "@/components/common/ShomiBottomSheet";
import { getUserIngredients } from "@/services/user-ingredientService";
import ShomiButton from "../common/ShomiButton";

interface DeductionPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  data: DeductionPreview[];
  userId: string;
  onConfirm: (final: DeductionPreview[]) => void;
}

const DeductionPreviewModal: React.FC<DeductionPreviewModalProps> = ({ visible, onClose, data, userId, onConfirm }) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;

  const [localData, setLocalData] = useState<DeductionPreview[]>(data);
  const [pantryOptions, setPantryOptions] = useState<UserIngredient[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible && userId) {
      getUserIngredients(userId)
        .then(setPantryOptions)
        .catch((err) => console.error("Error loading pantry:", err));

      setError("");
      setShowError(false);
    }
  }, [visible, userId]);

  useEffect(() => {
    if (visible && data.length > 0) {
      setLocalData(data);
    }
  }, [visible, data]);

  const handleOpenSelect = (index: number) => {
    setSelectedIndex(index);
    setIsBottomSheetVisible(true);
  };

  const handleSelectPantryItem = (item: UserIngredient) => {
    if (selectedIndex === null) return;

    const recipeUnitType = localData[selectedIndex].recipe_ingredient.unit;
    const recipeBaseType = getUnitBaseType(recipeUnitType);
    const selectedBaseType = getUnitBaseType(item.unitType);

    if (recipeBaseType !== selectedBaseType) {
      setShowError(true);
      setError(
        `The selected ingredient (${item.ingredient.Ing_name}) does not match the recipe ingredients unit type (${recipeUnitType}).`
      );
      return;
    }

    const updated = [...localData];
    updated[selectedIndex].matched_user_ingredient = {
      id: item.id,
      ingredient_id: item.ingredient.Ing_id,
      ingredient_name: item.ingredient.Ing_name,
      unit: item.unitType || "",
    };
    updated[selectedIndex].reason = "User selected manually";
    updated[selectedIndex].confidence_score = 10;
    setLocalData(updated);
    setSelectedIndex(null);
  };

  const handleDismiss = (index: number) => {
    const updated = [...localData];
    updated[index].matched_user_ingredient = null;
    updated[index].reason = "User dismissed this ingredient";
    updated[index].confidence_score = 0;
    setLocalData(updated);
  };

  const getUnitBaseType = (unit: string): "mass" | "volume" | null => {
    const massUnits = ["g", "kg", "mg", "oz", "lb"];
    const volumeUnits = ["ml", "l", "tsp", "tbsp", "cup"];
    const specialUnits = ["clove", "slice", "egg"];
    if (massUnits.includes(unit)) return "mass";
    if (volumeUnits.includes(unit)) return "volume";
    if (specialUnits.includes(unit)) return null;
    return null;
  };

  const allResolved = localData.some((item) => item.matched_user_ingredient);

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={{
        width: "90%",
        maxHeight: "80%",
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Text
        h4
        style={{
          textAlign: "center",
          marginBottom: 15,
          color: theme.colors.primary,
        }}
      >
        This Is What We Matched With Your Pantry
      </Text>

      <FlatList
        data={localData}
        keyExtractor={(item, index) => item.recipe_ingredient.ingredient_id + index}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginBottom: 12,
              padding: 15,
              backgroundColor: isDark ? theme.colors.black : theme.colors.white,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              borderWidth: 1,
              borderColor: theme.colors.greyOutline,
            }}
          >
            <Text style={{ marginBottom: 6, color: textColor, textAlign: "center" }}>
              {item.recipe_ingredient.quantity} {item.recipe_ingredient.unit} {item.recipe_ingredient.ingredient_name}
            </Text>

            <Text
              style={{
                fontWeight: "500",
                color: textColor,
                textAlign: "center",
                marginVertical: 2,
                marginBottom: 6,
              }}
            >
              matches
            </Text>

            <Text
              style={{
                color: item.matched_user_ingredient ? theme.colors.success : theme.colors.error,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {item.matched_user_ingredient ? item.matched_user_ingredient.ingredient_name : "No match"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                title="Edit"
                type="clear"
                onPress={() => handleOpenSelect(index)}
                icon={{
                  name: "pencil",
                  type: "material-community",
                  size: 16,
                  color: theme.colors.primary,
                }}
                titleStyle={{ color: theme.colors.primary, marginLeft: 4 }}
              />
              <Button
                title="Dismiss"
                type="clear"
                onPress={() => handleDismiss(index)}
                icon={{
                  name: "close",
                  type: "material-community",
                  size: 16,
                  color: theme.colors.error,
                }}
                titleStyle={{ color: theme.colors.error, marginLeft: 4 }}
              />
            </View>
          </View>
        )}
      />

      {showError && (
        <Text
          style={{
            color: theme.colors.error,
            textAlign: "center",
            marginTop: 10,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {error}
        </Text>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ShomiButton
          title="Cancel"
          onPress={onClose}
          buttonStyle={{
            backgroundColor: theme.colors.grey3,
            paddingHorizontal: 20,
          }}
          titleStyle={{ color: theme.colors.white }}
        />
        <ShomiButton
          title="Confirm"
          onPress={() => onConfirm(localData)}
          disabled={!allResolved}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
          }}
          titleStyle={{ color: theme.colors.white }}
        />
      </View>

      <BottomSheetSelect<UserIngredient>
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        data={pantryOptions}
        onSelect={handleSelectPantryItem}
        keyExtractor={(item) => item.id}
        labelExtractor={(item) => `${item.ingredient.Ing_name}`}
        placeholder="Search pantry..."
      />
    </Overlay>
  );
};

export default DeductionPreviewModal;
