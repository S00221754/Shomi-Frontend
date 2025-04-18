import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Overlay, Button, Input, Text, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import * as Yup from "yup";
import { ProductInfo, SelectedIngredient } from "@/Interfaces/ingredient";
import { Ingredient } from "@/Interfaces/recipe";
import { UnitType } from "@/Interfaces/unit-type";
import { useGetUnitTypes } from "@/hooks/useGetUnitTypes";
import { useGetIngredient } from "@/hooks/useGetIngredient";
import ShomiBottomSheet from "@/components/common/ShomiBottomSheet";
import ShomiButton from "../common/ShomiButton";
import { recipeIngredientValidationSchema } from "@/validation/RecipeSchema";

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
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const { unitTypes } = useGetUnitTypes();
  const { ingredients } = useGetIngredient();

  const [ingredientSheetVisible, setIngredientSheetVisible] = useState(false);
  const [unitTypeSheetVisible, setUnitTypeSheetVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<ProductInfo | null>(null);
  const [filteredUnitTypes, setFilteredUnitTypes] = useState<UnitType[]>([]);

  useEffect(() => {
    if (initialData) {
      const found = ingredients.find(
        (ing) => ing.Ing_id!.toString() === initialData.ingredient_id
      );
      if (found) setSelectedIngredient(found);
    }
  }, [initialData, ingredients]);

  useEffect(() => {
    if (selectedIngredient?.Ing_quantity_units) {
      const selected = unitTypes.find(
        (u) => u.name === selectedIngredient.Ing_quantity_units
      );
      if (selected?.type) {
        setFilteredUnitTypes(unitTypes.filter((u) => u.type === selected.type));
      }
    }
  }, [selectedIngredient, unitTypes]);

  return (
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
      <Formik
        initialValues={{
          ingredient_name: initialData?.ingredient_name || "",
          quantity: initialData?.quantity?.toString() || "",
          unit: initialData?.unit || "",
        }}
        validationSchema={recipeIngredientValidationSchema}
        enableReinitialize
        onSubmit={(values) => {
          if (!selectedIngredient) return;
          onSave({
            ingredient_id: selectedIngredient.Ing_id!.toString(),
            ingredient_name: values.ingredient_name,
            quantity: parseFloat(values.quantity),
            unit: values.unit,
          });
          onClose();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          errors,
          touched,
        }) => (
          <>
            <Text
              h4
              style={{
                textAlign: "center",
                marginBottom: 10,
                color: theme.colors.primary,
              }}
            >
              {initialData ? "Edit Ingredient" : "Add Ingredient"}
            </Text>

            <Text style={{ color: textColor, marginBottom: 4 }}>
              Ingredient
            </Text>
            <ShomiButton
              title={values.ingredient_name || "Select Ingredient"}
              onPress={() => setIngredientSheetVisible(true)}
              buttonStyle={{ marginBottom: 10 }}
              type="outline"
              titleStyle={{ color: theme.colors.primary }}
              color={theme.colors.secondary}
            />
            {touched.ingredient_name && errors.ingredient_name && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {errors.ingredient_name}
              </Text>
            )}

            <Input
              label="Quantity"
              value={values.quantity}
              onChangeText={handleChange("quantity")}
              onBlur={handleBlur("quantity")}
              keyboardType="numeric"
              errorMessage={
                touched.quantity && errors.quantity
                  ? errors.quantity
                  : undefined
              }
              inputStyle={{
                color: textColor,
              }}
              labelStyle={{
                color: textColor,
              }}
              containerStyle={{ marginBottom: 10 }}
            />

            <Text style={{ color: theme.colors.grey3, marginBottom: 4 }}>
              Unit
            </Text>
            <ShomiButton
              title={values.unit || "Select Unit Type"}
              onPress={() => setUnitTypeSheetVisible(true)}
              buttonStyle={{ marginBottom: 20 }}
              type="outline"
              titleStyle={{ color: theme.colors.primary }}
              color={theme.colors.secondary}
            />
            {touched.unit && errors.unit && (
              <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
                {errors.unit}
              </Text>
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ShomiButton
                title="Cancel"
                onPress={onClose}
                color={theme.colors.error}
                titleStyle={{ color: theme.colors.white }}
              />
              <ShomiButton
                title={initialData ? "Update" : "Add"}
                onPress={handleSubmit as any}
                buttonStyle={{ backgroundColor: theme.colors.primary }}
                titleStyle={{ color: theme.colors.white }}
              />
            </View>

            <ShomiBottomSheet<ProductInfo>
              isVisible={ingredientSheetVisible}
              onClose={() => setIngredientSheetVisible(false)}
              data={ingredients}
              onSelect={(item) => {
                setSelectedIngredient(item);
                setFieldValue("ingredient_name", item.Ing_name);
                if (item.Ing_quantity_units) {
                  setFieldValue("unit", item.Ing_quantity_units);
                }
              }}
              keyExtractor={(item) => item.Ing_id!.toString()}
              labelExtractor={(item) => item.Ing_name}
              placeholder="Search ingredients..."
            />

            <ShomiBottomSheet<UnitType>
              isVisible={unitTypeSheetVisible}
              onClose={() => setUnitTypeSheetVisible(false)}
              data={filteredUnitTypes}
              onSelect={(item) => setFieldValue("unit", item.name)}
              keyExtractor={(item) => item.id}
              labelExtractor={(item) => item.name}
              placeholder="Search unit types..."
            />
          </>
        )}
      </Formik>
    </Overlay>
  );
};

export default RecipeIngredientModal;
