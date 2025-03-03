import { useState } from "react";
import { ProductInfo } from "../types/ingredient";
import { addIngredient } from "../services/ingredientsService";
import { useAuth } from "@/context/AuthContext";
import { addUserIngredient } from "@/services/user-ingredientService";
import { UserIngredientInput } from "@/types/user-ingredient";
import { useGetUserIngredients } from "./useGetUserIngredients";

export const useScannerLogic = (setIsAddIngredientModalVisible: (visible: boolean) => void, setIsAddUserIngredientModalVisible: (visible: boolean) => void) => {
    const { userId } = useAuth();
    const [scannedData, setScannedData] = useState<ProductInfo | null>(null);
    const [userIngredient, setUserIngredient] = useState<UserIngredientInput | null>(null);

    const { fetchUserIngredients } = useGetUserIngredients(userId!);

    const handleBarcodeScanned = async (productInfo: ProductInfo) => {
        setScannedData(productInfo);

        if (!productInfo.In_Database) {
            setIsAddIngredientModalVisible(true);
        } else {
            setUserIngredient({
                userId: userId!,
                ingredientId: productInfo.Ing_id!,
                unitQuantity: 1,
                totalAmount: 1,
                unitType: productInfo.Ing_units ? productInfo.Ing_units[0] : "",
                expiryDate: "",
            });
            setIsAddUserIngredientModalVisible(true);
        }
    };

    const handleAddIngredient = async (ingredient: ProductInfo, unitInput: string) => {
        if (!unitInput) return;
        ingredient.Ing_units = ingredient.Ing_units ? [...ingredient.Ing_units, unitInput] : [unitInput];

        try {
            const newIngredient = await addIngredient(ingredient);

            if (newIngredient) {
                setUserIngredient({
                    userId: userId!,
                    ingredientId: newIngredient.Ing_id!,
                    unitQuantity: 1,
                    totalAmount: 1,
                    unitType: unitInput,
                    expiryDate: "",
                });

                setIsAddUserIngredientModalVisible(true);
            }

            setIsAddIngredientModalVisible(false);
        } catch (error) {
            console.error("Error adding ingredient:", error);
        }
    };

    const handleAddUserIngredient = async (userIngredient: UserIngredientInput) => {
        console.log("useringredient", userIngredient);

        try {
            await addUserIngredient(userIngredient);
            fetchUserIngredients();
            setIsAddUserIngredientModalVisible(false);
        } catch (error) {
            console.error("Error adding user ingredient:", error);
        }
    };

    return {
        scannedData,
        userIngredient,
        handleBarcodeScanned,
        handleAddIngredient,
        handleAddUserIngredient,
    };
};