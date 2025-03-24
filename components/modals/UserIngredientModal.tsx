import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { Overlay, Button, Text, Input } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { UserIngredientInput } from "@/types/user-ingredient";
import { ProductInfo } from "@/types/ingredient";

interface UserIngredientModalProps {
    visible: boolean;
    onClose: () => void;
    userIngredient: UserIngredientInput | null;
    onAddUserIngredient: (userIngredient: UserIngredientInput) => Promise<void>;
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
    const prevIngredientRef = useRef<ProductInfo | null>(null);

    const [unitQuantity, setUnitQuantity] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [unitType, setUnitType] = useState("");

    useEffect(() => {
        if (ingredient && ingredient !== prevIngredientRef.current) {
            prevIngredientRef.current = ingredient;

            setTotalAmount(ingredient.Ing_quantity?.toString() || "");
            
            setUnitType(ingredient.Ing_quantity_units || "");
        }
    }, [ingredient, visible]);

    useEffect(() => {
        if (unitQuantity && ingredient?.Ing_quantity) {
            const newTotal = (parseFloat(unitQuantity) * ingredient.Ing_quantity).toString();
            if (newTotal !== totalAmount) setTotalAmount(newTotal);
        }
    }, [unitQuantity, ingredient]);

    if (!userIngredient || !ingredient) return null;

    const handleAddClick = async () => {        
        if (!unitQuantity || !unitType) return;

        userIngredient.unitQuantity = parseFloat(unitQuantity);
        userIngredient.totalAmount = parseFloat(totalAmount) || 0;
        userIngredient.unitType = unitType;

        await onAddUserIngredient(userIngredient);
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
            <Text h4 style={{ color: theme.colors.primary, textAlign: "center", marginBottom: 10 }}>
                Add to Pantry
            </Text>

            <Text style={{ color: theme.colors.black, textAlign: "center", marginBottom: 10 }}>
                Ingredient Name: {ingredient?.Ing_name}
            </Text>

            {/* Unit Quantity Input */}
            <Input
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
                placeholder="Total Amount"
                placeholderTextColor={theme.colors.grey3}
                value={totalAmount}
                disabled 
                inputStyle={{ color: theme.colors.black }}
                containerStyle={{ marginBottom: 10 }}
            />

            {/* Unit Type Input (Readonly) */}
            <Input
                placeholder="Unit Type"
                placeholderTextColor={theme.colors.grey3}
                value={unitType}
                disabled
                inputStyle={{ color: theme.colors.black }}
                containerStyle={{ marginBottom: 10 }}
            />

            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
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
