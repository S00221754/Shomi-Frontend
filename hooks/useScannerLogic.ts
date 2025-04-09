import { useState } from "react";
import { ProductInfo, UserIngredient } from "../Interfaces/ingredient";
import { addIngredient } from "../services/ingredientsService";
import { useAuth } from "@/providers/AuthProvider";
import {
  addUserIngredient,
  getUserIngredientByIngredientId,
} from "@/services/user-ingredientService";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import { useGetUserIngredients } from "./useGetUserIngredients";

export const useScannerLogic = (
  setIsAddIngredientModalVisible: (visible: boolean) => void,
  setIsAddUserIngredientModalVisible: (visible: boolean) => void,
  setSelectedUserIngredient: (ingredient: UserIngredient) => void,
  setSelectedUserIngredientId: (id: string) => void,
  setIsUpdateUserIngredientModalVisible: (visible: boolean) => void,
  fetchUserIngredients: () => void
) => {
  const { userId } = useAuth();
  const [scannedData, setScannedData] = useState<ProductInfo | null>(null);
  const [userIngredient, setUserIngredient] =
    useState<UserIngredientInput | null>(null);

  const handleBarcodeScanned = async (productInfo: ProductInfo) => {
    setScannedData(productInfo);

    if (!productInfo.In_Database) {
      // Check for missing details (quantity & unit type)
      const missingFields = getMissingFields(productInfo);

      if (missingFields.length > 0) {
        // If fields are missing, prompt user to fill them
        setIsAddIngredientModalVisible(true);
      } else {
        // If all details exist, auto-add to DB
        try {
          const newIngredient = await addIngredient(productInfo);

          if (newIngredient) {
            setUserIngredient({
              userId: userId!,
              ingredientId: newIngredient.Ing_id!,
              unitQuantity: 1,
              totalAmount: productInfo.Ing_quantity || 1,
              unitType: productInfo.Ing_quantity_units || "",
              expiryDate: "",
            });
            setIsAddUserIngredientModalVisible(true);
          }
        } catch (error) {
          console.error("Error adding ingredient:", error);
        }
      }
    } else {
      // Check if ingredient is already in user's pantry
      const inPantry = await getUserIngredientByIngredientId(
        userId!,
        productInfo.Ing_id!
      );

      if (inPantry) {
        setSelectedUserIngredient(inPantry);
        setSelectedUserIngredientId(inPantry.id);
        setIsUpdateUserIngredientModalVisible(true);
        return;
      }

      // If already in DB, just ask user how many they have
      setUserIngredient({
        userId: userId!,
        ingredientId: productInfo.Ing_id!,
        unitQuantity: 1,
        totalAmount: productInfo.Ing_quantity || 1,
        unitType: productInfo.Ing_quantity_units || "",
        expiryDate: "",
      });
      setIsAddUserIngredientModalVisible(true);
    }
  };

  const handleAddIngredient = async (ingredient: ProductInfo) => {
    if (!ingredient.Ing_quantity_units || !ingredient.Ing_quantity) {
      console.warn("Missing required fields: Unit or Quantity");
      return;
    }

    try {
      const newIngredient = await addIngredient(ingredient);

      if (newIngredient) {
        const updatedIngredient = {
          ...newIngredient,
          Ing_units: newIngredient.Ing_quantity_units,
        };

        setUserIngredient({
          userId: userId!,
          ingredientId: updatedIngredient.Ing_id!,
          unitQuantity: 1,
          totalAmount: updatedIngredient.Ing_quantity || 1,
          unitType: updatedIngredient.Ing_units || "",
          expiryDate: "",
        });

        setScannedData(updatedIngredient);
        setIsAddUserIngredientModalVisible(true);
        fetchUserIngredients();
      }

      setIsAddIngredientModalVisible(false);
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleAddUserIngredient = async (
    userIngredient: UserIngredientInput
  ) => {
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

// Helper function to check for missing fields
const getMissingFields = (product: ProductInfo) => {
  let missing = [];

  if (!product.Ing_name || product.Ing_name.trim() === "") {
    missing.push("Product Name");
  }

  if (!product.Ing_brand || product.Ing_brand.trim() === "") {
    missing.push("Brand");
  }

  if (!product.Ing_quantity) {
    missing.push("Quantity");
  }

  if (!product.Ing_quantity_units) {
    missing.push("Unit Type");
  }

  return missing;
};
