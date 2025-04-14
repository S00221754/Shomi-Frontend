import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Overlay, Button, Text, Input, Icon } from "@rneui/themed";
import { useTheme, BottomSheet, SearchBar, ListItem } from "@rneui/themed";
import { ProductInfo } from "@/Interfaces/ingredient";
import { useGetUnitTypes } from "@/hooks/useGetUnitTypes";
import { UnitType } from "@/Interfaces/unit-type";
import ShomiBottomSheet from "../common/ShomiBottomSheet";
import { useGetIngredientCategories } from "@/hooks/useGetIngredientCategories";
import { IngredientCategory } from "@/Interfaces/ingredient-category";

// Initially was only to show up when details were missing but open food facts does not give catogories consistently so we prompt the user to enter the details.
interface IngredientModalProps {
  visible: boolean;
  onClose: () => void;
  ingredient: ProductInfo | null;
  onAddIngredient: (ingredient: ProductInfo) => Promise<void>;
}
//TODO: openfoodfacts api can return no name so need to fix this.
const IngredientModal: React.FC<IngredientModalProps> = ({
  visible,
  onClose,
  ingredient,
  onAddIngredient,
}) => {
  const { theme } = useTheme();

  const { unitTypes } = useGetUnitTypes();

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnitTypes, setFilteredUnitTypes] = useState<UnitType[]>([]);

  const [unitType, setUnitType] = useState("");
  const [quantity, setQuantity] = useState("");

  const { categories } = useGetIngredientCategories();
  const [selectedCategory, setSelectedCategory] =
    useState<IngredientCategory | null>(null);
  const [isCategorySheetVisible, setIsCategorySheetVisible] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setUnitType(ingredient.Ing_quantity_units || "");
      setQuantity(
        ingredient.Ing_quantity && ingredient.Ing_quantity !== 0
          ? ingredient.Ing_quantity.toString()
          : ""
      );
    } else {
      setUnitType("");
      setQuantity("");
    }
  }, [ingredient, visible]);

  useEffect(() => {
    setFilteredUnitTypes(unitTypes);
  }, [unitTypes]);

  useEffect(() => {
    const filtered = unitTypes.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUnitTypes(filtered);
  }, [searchTerm]);

  useEffect(() => {
    if (ingredient && ingredient.category?.id) {
      const found = categories.find((c) => c.id === ingredient.category?.id);
      setSelectedCategory(found || null);
    } else {
      setSelectedCategory(null);
    }
  }, [ingredient, categories]);

  if (!ingredient) return null;

  const handleAddClick = async () => {
    if (!unitType || !quantity) return;

    if (selectedCategory) {
      ingredient.category = {
        id: selectedCategory.id,
        name: selectedCategory.name,
      };
    }

    ingredient.Ing_quantity_units = unitType;
    ingredient.Ing_quantity = parseFloat(quantity);

    await onAddIngredient(ingredient);
    console.log("resetting form", ingredient);

    resetForm();
  };

  const resetForm = () => {
    setUnitType("");
    setQuantity("");
    setSelectedCategory(null);

    if (ingredient) {
      ingredient.category = undefined;
    }
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
            color: theme.colors.primary,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Enter Missing Details
        </Text>

        <Text
          style={{
            color: theme.colors.black,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {ingredient.Ing_name}{" "}
          {ingredient.Ing_brand ? `(${ingredient.Ing_brand})` : ""}
        </Text>

        {!ingredient.Ing_quantity && (
          <Input
            placeholder="Enter quantity"
            placeholderTextColor={theme.colors.grey3}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            inputStyle={{ color: theme.colors.black }}
            containerStyle={{ marginBottom: 10 }}
          />
        )}

        {!ingredient.Ing_quantity_units && (
          <>
            <Text style={{ color: theme.colors.black, marginBottom: 5 }}>
              Select Unit Type
            </Text>
            <Button
              title={unitType ? unitType : "Select a unit type"}
              onPress={() => setIsSheetVisible(true)}
              type="outline"
              buttonStyle={{
                borderColor: theme.colors.grey3,
                borderRadius: 8,
                backgroundColor: theme.colors.white,
                marginBottom: 10,
              }}
              titleStyle={{
                color: unitType ? theme.colors.black : theme.colors.grey2,
                textAlign: "left",
              }}
            />
          </>
        )}

        {!ingredient.category?.id && (
          <>
            <Text style={{ color: theme.colors.black, marginBottom: 5 }}>
              Select Category
            </Text>
            <Button
              title={
                selectedCategory ? selectedCategory.name : "Select a category"
              }
              onPress={() => setIsCategorySheetVisible(true)}
              type="outline"
              buttonStyle={{
                borderColor: theme.colors.grey3,
                borderRadius: 8,
                backgroundColor: theme.colors.white,
                marginBottom: 10,
              }}
              titleStyle={{
                color: selectedCategory
                  ? theme.colors.black
                  : theme.colors.grey2,
                textAlign: "left",
              }}
            />
          </>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Button
            title="Cancel"
            onPress={onClose}
            buttonStyle={{
              backgroundColor: theme.colors.error,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
          />
          <Button
            title="Save"
            onPress={handleAddClick}
            buttonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 15,
            }}
            titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
          />
        </View>
      </Overlay>

      <ShomiBottomSheet
        isVisible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        data={filteredUnitTypes}
        onSelect={(unit) => {
          setUnitType(unit.name);
          setIsSheetVisible(false);
        }}
        keyExtractor={(unit) => unit.id}
        labelExtractor={(unit) => unit.name}
        placeholder="Search unit types..."
      />

      <ShomiBottomSheet
        isVisible={isCategorySheetVisible}
        onClose={() => setIsCategorySheetVisible(false)}
        data={categories}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setIsCategorySheetVisible(false);
        }}
        keyExtractor={(cat) => cat.id}
        labelExtractor={(cat) => cat.name}
        placeholder="Search categories..."
      />
    </>
  );
};

export default IngredientModal;
