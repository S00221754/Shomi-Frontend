import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Overlay, Button, Text, Input } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { UserIngredientUpdate } from "@/Interfaces/user-ingredient";
import { UserIngredient } from "@/Interfaces/ingredient";
import { getIngredientById } from "@/services/ingredientsService";

interface UpdateUserIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  userIngredient: UserIngredient | null;
  onUpdateUserIngredient: (
    userIngredientId: string,
    updatedIngredient: UserIngredientUpdate
  ) => Promise<void>;
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
  const [unitQuantity, setUnitQuantity] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [unitType, setUnitType] = useState("");
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [baseQuantity, setBaseQuantity] = useState(1);

  useEffect(() => {
    const fetchBaseIngredient = async () => {
      if (userIngredient?.ingredient.Ing_id) {
        try {
          const ingredientData = await getIngredientById(
            userIngredient.ingredient.Ing_id
          );
          setBaseQuantity(ingredientData.Ing_quantity || 1);
        } catch (error) {
          console.error("Error fetching base ingredient:", error);
        }
      }
    };

    if (visible) fetchBaseIngredient();
  }, [visible, userIngredient]);

  useEffect(() => {
    if (userIngredient) {
      setUnitQuantity(userIngredient.unitQuantity.toString());
      setTotalAmount(userIngredient.totalAmount?.toString() || "");
      setUnitType(userIngredient.unitType || "");
      setExpiryDate(userIngredient.expiryDate || "");
    }
  }, [userIngredient, visible]);

  useEffect(() => {
    if (unitQuantity) {
      const newTotal = (parseFloat(unitQuantity) * baseQuantity).toString();
      setTotalAmount(newTotal);
    }
  }, [unitQuantity, baseQuantity]);

  if (!userIngredient || !userIngredientId) return null;

  const handleUpdateClick = async () => {
    if (!unitQuantity || !unitType) return;

    const updatedIngredient: UserIngredientUpdate = {
      unitQuantity: parseFloat(unitQuantity),
      totalAmount: parseFloat(totalAmount) || 0,
      unitType,
      expiry_date: expiryDate || null,
    };

    await onUpdateUserIngredient(userIngredientId, updatedIngredient);
    onClose();
  };

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

      {/* Unit Quantity Input */}
      <Input
        label="Quantity"
        placeholder="Enter Quantity"
        placeholderTextColor={theme.colors.grey3}
        keyboardType="numeric"
        value={unitQuantity}
        onChangeText={setUnitQuantity}
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ marginBottom: 10 }}
      />

      {/* Total Amount Input (Readonly) */}
      <Input
        label="Total Amount"
        placeholder="Total Amount"
        placeholderTextColor={theme.colors.grey3}
        value={totalAmount}
        disabled
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ marginBottom: 10 }}
      />

      {/* Unit Type Input */}
      <Input
        label="Unit Type"
        placeholder="Unit Type"
        placeholderTextColor={theme.colors.grey3}
        value={unitType}
        disabled
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ marginBottom: 10 }}
      />

      {/* Expiry Date Input */}
      <Input
        label="Expiry Date"
        placeholder="Enter Expiry Date (YYYY-MM-DD)"
        placeholderTextColor={theme.colors.grey3}
        value={expiryDate ?? undefined}
        onChangeText={setExpiryDate}
        inputStyle={{ color: theme.colors.black }}
        containerStyle={{ marginBottom: 10 }}
      />

      {/* Buttons */}
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
          onPress={handleUpdateClick}
          buttonStyle={{
            backgroundColor: theme.colors.warning,
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

export default UpdateUserIngredientModal;
