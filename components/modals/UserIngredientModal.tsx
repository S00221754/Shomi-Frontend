import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Overlay, Button, Text, Input, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import { ProductInfo } from "@/Interfaces/ingredient";
import DateTimePicker from "@react-native-community/datetimepicker";
import UserIngredientSchema from "@/validation/UserIngredientSchema";

interface UserIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  userIngredient: UserIngredientInput | null;
  onAddUserIngredient: (userIngredient: UserIngredientInput) => Promise<boolean>;
  ingredient: ProductInfo | null;
}

const UserIngredientModal: React.FC<UserIngredientModalProps> = ({
  visible,
  onClose,
  userIngredient,
  onAddUserIngredient,
  ingredient,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!userIngredient || !ingredient) return null;

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
          unitQuantity: "1",
          expiry_date: "",
        }}
        validationSchema={UserIngredientSchema}
        onSubmit={async (values, { resetForm }) => {
          const parsedUnitQty = parseFloat(values.unitQuantity);
          const baseQty = ingredient.Ing_quantity || 1;
          const totalAmount = parsedUnitQty * baseQty;

          userIngredient.unitQuantity = parsedUnitQty;
          userIngredient.totalAmount = totalAmount;
          userIngredient.unitType = ingredient.Ing_quantity_units || "";
          userIngredient.expiry_date = values.expiry_date || null;

          const success = await onAddUserIngredient(userIngredient);
          if (!success) {
            setErrorMessage(
              values.expiry_date?.trim()
                ? "This ingredient already exists in your pantry with that expiration date."
                : "You already have this ingredient in your pantry."
            );
          } else {
            setErrorMessage(null);
            resetForm();
            onClose();
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => {
          const totalAmount = (() => {
            const qty = parseFloat(values.unitQuantity);
            const base = parseFloat(ingredient.Ing_quantity?.toString() || "1");
            return !isNaN(qty) && !isNaN(base) ? (qty * base).toFixed(0) : "";
          })();

          return (
            <>
              <Text
                h4
                style={{
                  color: theme.colors.primary,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Add to Pantry
              </Text>

              <Text
                style={{
                  color: textColor,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Ingredient Name: {ingredient.Ing_name}
              </Text>

              <Input
                label="Quantity"
                placeholder="Enter Quantity"
                placeholderTextColor={theme.colors.grey3}
                keyboardType="numeric"
                value={values.unitQuantity}
                onChangeText={handleChange("unitQuantity")}
                onBlur={handleBlur("unitQuantity")}
                errorMessage={touched.unitQuantity && errors.unitQuantity ? errors.unitQuantity : undefined}
                inputStyle={{ color: textColor }}
                labelStyle={{ color: textColor }}
                containerStyle={{ marginBottom: 10 }}
              />

              <Input
                label="Total Amount"
                placeholder="0"
                placeholderTextColor={theme.colors.grey2}
                value={totalAmount}
                disabled
                inputStyle={{ color: textColor }}
                labelStyle={{ color: textColor }}
                containerStyle={{ marginBottom: 10 }}
              />

              <Input
                label="Unit Type"
                placeholder="Unit Type"
                placeholderTextColor={theme.colors.grey3}
                value={ingredient.Ing_quantity_units || ""}
                disabled
                inputStyle={{ color: textColor }}
                labelStyle={{ color: textColor }}
                containerStyle={{ marginBottom: 10 }}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.9}>
                <Input
                  label="Expiry Date (optional)"
                  placeholder="YYYY-MM-DD"
                  value={values.expiry_date}
                  editable={false}
                  pointerEvents="none"
                  inputStyle={{ color: textColor }}
                  labelStyle={{ color: textColor }}
                  leftIcon={{
                    type: "material-community",
                    name: "calendar",
                    onPress: () => setShowDatePicker(true),
                    color: theme.colors.primary,
                  }}
                  rightIcon={
                    values.expiry_date
                      ? {
                          type: "material-community",
                          name: "close-circle",
                          onPress: () => setFieldValue("expiry_date", ""),
                          color: theme.colors.error,
                        }
                      : undefined
                  }
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={values.expiry_date ? new Date(values.expiry_date) : new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const formatted = selectedDate.toISOString().split("T")[0];
                      setFieldValue("expiry_date", formatted);
                    }
                  }}
                />
              )}

              {errorMessage && (
                <Text
                  style={{
                    color: theme.colors.error,
                    textAlign: "center",
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                >
                  {errorMessage}
                </Text>
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
                    backgroundColor: theme.colors.grey3,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
                />
                <Button
                  title="Save"
                  onPress={handleSubmit as any}
                  buttonStyle={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </Overlay>
  );
};

export default UserIngredientModal;
