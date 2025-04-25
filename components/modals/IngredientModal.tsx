import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Overlay, Text, Input, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import { ProductInfo } from "@/Interfaces/ingredient";
import { useGetUnitTypes } from "@/hooks/useGetUnitTypes";
import { UnitType } from "@/Interfaces/unit-type";
import ShomiBottomSheet from "../common/ShomiBottomSheet";
import { useGetIngredientCategories } from "@/hooks/useGetIngredientCategories";
import { IngredientCategory } from "@/Interfaces/ingredient-category";
import ShomiButton from "../common/ShomiButton";
import IngredientSchema from "@/validation/IngredientSchema";

interface IngredientModalProps {
  visible: boolean;
  onClose: () => void;
  ingredient: ProductInfo | null;
  onAddIngredient: (ingredient: ProductInfo) => Promise<void>;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, ingredient, onAddIngredient }) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;

  const { unitTypes } = useGetUnitTypes();
  const { categories } = useGetIngredientCategories();

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnitTypes, setFilteredUnitTypes] = useState<UnitType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | null>(null);
  const [isCategorySheetVisible, setIsCategorySheetVisible] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    setFilteredUnitTypes(unitTypes);
  }, [unitTypes]);

  useEffect(() => {
    const filtered = unitTypes.filter((type) => type.name.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const isMissing = (field: any) => !field || field === "" || field === "0";

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
        <Formik
          initialValues={{
            Ing_name: ingredient.Ing_name || "",
            Ing_brand: ingredient.Ing_brand || "",
            Ing_quantity: ingredient.Ing_quantity?.toString() || "",
            Ing_quantity_units: ingredient.Ing_quantity_units || "",
          }}
          validationSchema={IngredientSchema}
          enableReinitialize
          onSubmit={async (values) => {
            if (!selectedCategory) {
              setCategoryError("Category is required");
              return;
            } else {
              setCategoryError(null);
            }

            ingredient.Ing_name = values.Ing_name;
            ingredient.Ing_brand = values.Ing_brand;
            ingredient.Ing_quantity = parseFloat(values.Ing_quantity);
            ingredient.Ing_quantity_units = values.Ing_quantity_units;
            ingredient.category = {
              id: selectedCategory.id,
              name: selectedCategory.name,
            };

            await onAddIngredient(ingredient);
            onClose();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
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
                  fontSize: 12,
                  color: theme.colors.grey3,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Ingredient information provided by Open Food Facts.
              </Text>

              <Input
                label="Product Name"
                value={values.Ing_name}
                onChangeText={handleChange("Ing_name")}
                onBlur={handleBlur("Ing_name")}
                inputStyle={{ color: textColor }}
                labelStyle={{ color: textColor }}
                errorMessage={touched.Ing_name && errors.Ing_name ? errors.Ing_name : undefined}
                disabled={!isMissing(ingredient.Ing_name)}
              />

              {isMissing(ingredient.Ing_brand) && (
                <Input
                  label="Brand (Optional)"
                  value={values.Ing_brand}
                  onChangeText={handleChange("Ing_brand")}
                  onBlur={handleBlur("Ing_brand")}
                  inputStyle={{ color: textColor }}
                  labelStyle={{ color: textColor }}
                  errorMessage={touched.Ing_brand && errors.Ing_brand ? errors.Ing_brand : undefined}
                />
              )}

              {isMissing(ingredient.Ing_quantity) && (
                <Input
                  label="Quantity"
                  value={values.Ing_quantity}
                  keyboardType="numeric"
                  onChangeText={handleChange("Ing_quantity")}
                  onBlur={handleBlur("Ing_quantity")}
                  errorMessage={touched.Ing_quantity && errors.Ing_quantity ? errors.Ing_quantity : undefined}
                  inputStyle={{ color: textColor }}
                  labelStyle={{ color: textColor }}
                />
              )}

              {isMissing(ingredient.Ing_quantity_units) && (
                <>
                  <Text style={{ color: textColor, marginBottom: 5 }}>Select Unit Type</Text>
                  <ShomiButton
                    title={values.Ing_quantity_units || "Select a unit type"}
                    onPress={() => setIsSheetVisible(true)}
                    color={theme.colors.secondary}
                    type="outline"
                  />
                  {touched.Ing_quantity_units && errors.Ing_quantity_units && (
                    <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.Ing_quantity_units}</Text>
                  )}
                </>
              )}

              {!ingredient.category?.id && (
                <>
                  <Text style={{ color: textColor, marginBottom: 5 }}>Select Category</Text>
                  <ShomiButton
                    title={selectedCategory ? selectedCategory.name : "Select a category"}
                    type="outline"
                    onPress={() => setIsCategorySheetVisible(true)}
                    color={theme.colors.secondary}
                  />
                  {categoryError && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{categoryError}</Text>}
                </>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <ShomiButton
                  title="Cancel"
                  onPress={onClose}
                  buttonStyle={{
                    backgroundColor: theme.colors.error,
                    borderRadius: 10,
                  }}
                />
                <ShomiButton title="Save" onPress={handleSubmit as any} />
              </View>

              <ShomiBottomSheet
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                data={filteredUnitTypes}
                onSelect={(unit) => {
                  setIsSheetVisible(false);
                  setFieldValue("Ing_quantity_units", unit.name);
                }}
                keyExtractor={(unit) => unit.id}
                labelExtractor={(unit) => unit.name}
                placeholder="Search unit types..."
              />
            </>
          )}
        </Formik>
      </Overlay>

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
        descriptionExtractor={(cat) => cat.description || ""}
      />
    </>
  );
};

export default IngredientModal;
