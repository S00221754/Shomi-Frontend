import React, { useState, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Overlay, Button, Text, Input, useTheme } from "@rneui/themed";
import { Formik } from "formik";
import { UserIngredientUpdate } from "@/Interfaces/user-ingredient";
import { UserIngredient } from "@/Interfaces/ingredient";
import { getIngredientById } from "@/services/ingredientsService";
import DateTimePicker from "@react-native-community/datetimepicker";
import UserIngredientSchema from "@/validation/UserIngredientSchema";

interface UpdateUserIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  userIngredient: UserIngredient | null;
  onUpdateUserIngredient: (userIngredientId: string, updatedIngredient: UserIngredientUpdate) => Promise<void>;
  userIngredientId: string | null;
}

const UpdateUserIngredientModal: React.FC<UpdateUserIngredientModalProps> = ({
  visible,
  onClose,
  userIngredient,
  onUpdateUserIngredient,
  userIngredientId,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [baseQuantity, setBaseQuantity] = useState(1);

  useEffect(() => {
    const fetchBaseIngredient = async () => {
      if (userIngredient?.ingredient.Ing_id) {
        try {
          const ingredientData = await getIngredientById(userIngredient.ingredient.Ing_id);
          setBaseQuantity(ingredientData.Ing_quantity || 1);
        } catch (error) {
          console.error("Error fetching base ingredient:", error);
        }
      }
    };

    if (visible) fetchBaseIngredient();
  }, [visible, userIngredient]);

  if (!userIngredient || !userIngredientId) return null;

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
          unitQuantity: userIngredient.unitQuantity.toString(),
          expiry_date: userIngredient.expiry_date || "",
        }}
        validationSchema={UserIngredientSchema}
        onSubmit={async (values) => {
          const parsedQty = parseFloat(values.unitQuantity);
          const updated: UserIngredientUpdate = {
            unitQuantity: parsedQty,
            totalAmount: parsedQty * baseQuantity,
            unitType: userIngredient.unitType,
            expiry_date: values.expiry_date || null,
          };
          await onUpdateUserIngredient(userIngredientId, updated);
          onClose();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => {
          const calculatedTotal = (() => {
            const qty = parseFloat(values.unitQuantity);
            return !isNaN(qty) ? (qty * baseQuantity).toFixed(0) : "";
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
                Update "{userIngredient.ingredient.Ing_name}"
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
                inputStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
                containerStyle={{ marginBottom: 10 }}
                labelStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
              />

              <Input
                label="Total Amount"
                placeholder="0"
                placeholderTextColor={theme.colors.grey3}
                value={calculatedTotal}
                disabled
                inputStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
                containerStyle={{ marginBottom: 10 }}
                labelStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
              />

              <Input
                label="Unit Type"
                placeholder="Unit Type"
                placeholderTextColor={theme.colors.grey3}
                value={userIngredient.unitType}
                disabled
                inputStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
                containerStyle={{ marginBottom: 10 }}
                labelStyle={{
                  color: isDark ? theme.colors.white : theme.colors.black,
                }}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.9}>
                <Input
                  label="Expiry Date (optional)"
                  placeholder="YYYY-MM-DD"
                  value={values.expiry_date}
                  editable={false}
                  pointerEvents="none"
                  inputStyle={{
                    color: isDark ? theme.colors.white : theme.colors.black,
                  }}
                  labelStyle={{
                    color: isDark ? theme.colors.white : theme.colors.black,
                  }}
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
                  title="Update"
                  onPress={handleSubmit as any}
                  buttonStyle={{
                    backgroundColor: theme.colors.warning,
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

export default UpdateUserIngredientModal;
