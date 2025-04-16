import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Overlay, Text, Button, useTheme } from "@rneui/themed";
import { DeductionPreview } from "@/Interfaces/recipe";
import { UserIngredient } from "@/Interfaces/ingredient";
import BottomSheetSelect from "@/components/common/ShomiBottomSheet";
import { getUserIngredients } from "@/services/user-ingredientService";

interface DeductionPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  data: DeductionPreview[];
  userId: string;
  onConfirm: (final: DeductionPreview[]) => void;
}

const DeductionPreviewModal: React.FC<DeductionPreviewModalProps> = ({
  visible,
  onClose,
  data,
  userId,
  onConfirm,
}) => {
  const { theme } = useTheme();

  const [localData, setLocalData] = useState<DeductionPreview[]>(data);
  const [pantryOptions, setPantryOptions] = useState<UserIngredient[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (visible && userId) {
      getUserIngredients(userId)
        .then(setPantryOptions)
        .catch((err) => console.error("Error loading pantry:", err));
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
      <>
        <Text h4 style={{ textAlign: "center", marginBottom: 15 }}>
          This Is What We Matched With Your Pantry
        </Text>

        <FlatList
          data={localData}
          keyExtractor={(item, index) =>
            item.recipe_ingredient.ingredient_id + index
          }
          renderItem={({ item, index }) => (
            <View
              style={{
                marginBottom: 12,
                padding: 15,
                backgroundColor: theme.colors.white,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                borderWidth: 1,
                borderColor: theme.colors.grey3,
              }}
            >
              <Text
                style={{
                  marginBottom: 6,
                  color: theme.colors.grey1,
                  textAlign: "center",
                }}
              >
                {item.recipe_ingredient.quantity} {item.recipe_ingredient.unit}{" "}
                {item.recipe_ingredient.ingredient_name}
              </Text>

              <Text
                style={{
                  fontWeight: "500",
                  color: theme.colors.grey2,
                  textAlign: "center",
                  marginVertical: 2,
                  marginBottom: 6,
                }}
              >
                matches
              </Text>

              <Text
                style={{
                  color: item.matched_user_ingredient
                    ? theme.colors.success
                    : theme.colors.error,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {item.matched_user_ingredient
                  ? item.matched_user_ingredient.ingredient_name
                  : "No match"}
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

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button title="Cancel" onPress={onClose} />
          <Button
            title="Confirm"
            onPress={() => onConfirm(localData)}
            buttonStyle={{ backgroundColor: theme.colors.success }}
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
      </>
    </Overlay>
  );
};

export default DeductionPreviewModal;
