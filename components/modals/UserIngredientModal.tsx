import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Overlay, Button, Text, Input, useTheme } from "@rneui/themed";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import { ProductInfo } from "@/Interfaces/ingredient";
import DateTimePicker from "@react-native-community/datetimepicker";

interface UserIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  userIngredient: UserIngredientInput | null;
  onAddUserIngredient: (
    userIngredient: UserIngredientInput
  ) => Promise<boolean>;
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
  const prevIngredientRef = useRef<ProductInfo | null>(null);

  const [unitQuantity, setUnitQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [unitType, setUnitType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (ingredient && ingredient !== prevIngredientRef.current) {
      prevIngredientRef.current = ingredient;
      setTotalAmount(ingredient.Ing_quantity?.toString() || "");
      setUnitType(ingredient.Ing_quantity_units || "");
    }
  }, [ingredient, visible]);

  useEffect(() => {
    if (unitQuantity && ingredient?.Ing_quantity) {
      const newTotal = (
        parseFloat(unitQuantity) * ingredient.Ing_quantity
      ).toString();
      if (newTotal !== totalAmount) setTotalAmount(newTotal);
    }
  }, [unitQuantity, ingredient]);

  if (!userIngredient || !ingredient) return null;

  const handleAddClick = async () => {
    if (!unitQuantity || !unitType) return;

    userIngredient.unitQuantity = parseFloat(unitQuantity);
    userIngredient.totalAmount = parseFloat(totalAmount) || 0;
    userIngredient.unitType = unitType;
    userIngredient.expiry_date = expiryDate || null;

    const success = await onAddUserIngredient(userIngredient);
    if (!success) {
      setErrorMessage(
        expiryDate?.trim()
          ? "This ingredient already exists in your pantry with that expiration date."
          : "You already have this ingredient in your pantry."
      );
    } else {
      setErrorMessage(null);
      setUnitQuantity("");
      setExpiryDate("");
    }
  };

  const resetForm = () => {
    setUnitQuantity("");
    setExpiryDate("");
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={handleClose}
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
        placeholder="Enter Quantity"
        placeholderTextColor={theme.colors.grey3}
        keyboardType="numeric"
        value={unitQuantity}
        onChangeText={setUnitQuantity}
        inputStyle={{ color: textColor }}
        containerStyle={{ marginBottom: 10 }}
      />

      <Input
        placeholder="Total Amount"
        placeholderTextColor={theme.colors.grey5}
        value={totalAmount}
        disabled
        inputStyle={{ color: textColor }}
        containerStyle={{ marginBottom: 10 }}
      />

      <Input
        placeholder="Unit Type"
        placeholderTextColor={theme.colors.grey3}
        value={unitType}
        disabled
        inputStyle={{ color: textColor }}
        containerStyle={{ marginBottom: 10 }}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.9}
      >
        <Input
          label="Expiry Date (optional)"
          placeholder="YYYY-MM-DD"
          value={expiryDate}
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
            expiryDate
              ? {
                  type: "material-community",
                  name: "close-circle",
                  onPress: () => setExpiryDate(""),
                  color: theme.colors.error,
                }
              : undefined
          }
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate ? new Date(expiryDate) : new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setExpiryDate(formatted);
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
          onPress={handleClose}
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
  );
};

export default UserIngredientModal;
