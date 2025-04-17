import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Overlay, Button, Input, Text } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { ProductInfo, SelectedIngredient } from "@/Interfaces/ingredient";
import { Ingredient } from "@/Interfaces/recipe";
import { UnitType } from "@/Interfaces/unit-type";
import { useGetUnitTypes } from "@/hooks/useGetUnitTypes";
import { useGetIngredient } from "@/hooks/useGetIngredient";
import ShomiBottomSheet from "@/components/common/ShomiBottomSheet";
import ShomiButton from "../common/ShomiButton";

interface RecipeIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  initialData?: SelectedIngredient;
}

const RecipeIngredientModal: React.FC<RecipeIngredientModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  const { unitTypes } = useGetUnitTypes();
  const { ingredients } = useGetIngredient();

  const [name, setName] = useState(initialData?.ingredient_name || "");
  const [quantity, setQuantity] = useState(
    initialData?.quantity?.toString() || ""
  );
  const [unit, setUnit] = useState(initialData?.unit || "");

  const [ingredientSheetVisible, setIngredientSheetVisible] = useState(false);
  const [unitTypeSheetVisible, setUnitTypeSheetVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<ProductInfo | null>(null);

  useEffect(() => {
    if (initialData) {
      const found = ingredients.find(
        (ing) => ing.Ing_id!.toString() === initialData.ingredient_id
      );
      if (found) setSelectedIngredient(found);
      setName(initialData.ingredient_name);
      setQuantity(initialData.quantity.toString());
      setUnit(initialData.unit);
    }
  }, [initialData, ingredients]);

  const handleIngredientSelect = (item: ProductInfo) => {
    setSelectedIngredient(item);
    setName(item.Ing_name);
    if (item.Ing_quantity_units) {
      setUnit(item.Ing_quantity_units);
    }
  };

  const handleUnitTypeSelect = (item: UnitType) => {
    setUnit(item.name);
  };

  const handleSave = () => {
    if (!name || !quantity || !unit || !selectedIngredient) return;

    onSave({
      ingredient_id: selectedIngredient.Ing_id!.toString(),
      ingredient_name: name,
      quantity: parseFloat(quantity),
      unit,
    });
    setName("");
    setQuantity("");
    setUnit("");
    setSelectedIngredient(null);
    onClose();
  };

  return (
    <>
      <Overlay
        isVisible={visible}
        onBackdropPress={onClose}
        overlayStyle={{
          width: "85%",
          backgroundColor: theme.colors.background,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text
          h4
          style={{
            textAlign: "center",
            marginBottom: 10,
            color:
              theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          }}
        >
          {initialData ? "Edit Ingredient" : "Add Ingredient"}
        </Text>

        <ShomiButton
          title={name || "Select Ingredient"}
          onPress={() => setIngredientSheetVisible(true)}
          buttonStyle={{
            marginBottom: 10,
            borderColor: theme.colors.grey2,
          }}
          titleStyle={{ color: theme.colors.white }}
          color={theme.colors.secondary}
        />

        <Input
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          inputStyle={{
            color:
              theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          }}
          labelStyle={{
            color:
              theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          }}
        />

        <ShomiButton
          title={unit || "Select Unit Type"}
          onPress={() => setUnitTypeSheetVisible(true)}
          buttonStyle={{
            marginBottom: 20,
            borderColor: theme.colors.grey2,
          }}
          titleStyle={{ color: theme.colors.white }}
          color={theme.colors.secondary}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ShomiButton
            title="Cancel"
            onPress={onClose}
            color={theme.colors.error}
            titleStyle={{
              color: theme.colors.white,
            }}
          />
          <ShomiButton
            title={initialData ? "Update" : "Add"}
            onPress={handleSave}
            buttonStyle={{ backgroundColor: theme.colors.primary }}
            titleStyle={{ color: theme.colors.white }}
          />
        </View>
      </Overlay>

      <ShomiBottomSheet<ProductInfo>
        isVisible={ingredientSheetVisible}
        onClose={() => setIngredientSheetVisible(false)}
        data={ingredients}
        onSelect={handleIngredientSelect}
        keyExtractor={(item) => item.Ing_id!.toString()}
        labelExtractor={(item) => item.Ing_name}
        placeholder="Search ingredients..."
      />

      <ShomiBottomSheet<UnitType>
        isVisible={unitTypeSheetVisible}
        onClose={() => setUnitTypeSheetVisible(false)}
        data={unitTypes}
        onSelect={handleUnitTypeSelect}
        keyExtractor={(item) => item.id}
        labelExtractor={(item) => item.name}
        placeholder="Search unit types..."
      />
    </>
  );
};

export default RecipeIngredientModal;
