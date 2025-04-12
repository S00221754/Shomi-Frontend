import { useState } from "react";
import { ProductInfo, UserIngredient } from "../Interfaces/ingredient";
import { addIngredient } from "../services/ingredientsService";
import { useAuth } from "@/providers/AuthProvider";
import {
  addUserIngredient,
  getUserIngredientByIngredientId,
  getUserIngredients,
} from "@/services/user-ingredientService";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import { useGetUserIngredients } from "./useGetUserIngredients";
import { showToast } from "@/utils/toast";

export const useScannerLogic = (
  userIngredients: UserIngredient[],
  setIsAddIngredientModalVisible: (visible: boolean) => void,
  setIsAddUserIngredientModalVisible: (visible: boolean) => void,
  setSelectedUserIngredient: (ingredient: UserIngredient) => void,
  setSelectedUserIngredientId: (id: string) => void,
  setIsUpdateUserIngredientModalVisible: (visible: boolean) => void,
  fetchUserIngredients: () => void,
  setMatchingIngredientVariants: (variants: UserIngredient[]) => void,
  setIsChooseBatchModalVisible: (visible: boolean) => void
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
        return;
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
              expiry_date: "",
            });
            setIsAddUserIngredientModalVisible(true);
          }
        } catch (error) {
          console.error("Error adding ingredient:", error);
        }
      }
    }

    const matchingVariants = userIngredients.filter(
      (item) => item.ingredient.Ing_id === productInfo.Ing_id
    );

    if (matchingVariants.length > 1) {
      setMatchingIngredientVariants(matchingVariants);
      setScannedData(productInfo);
      setIsChooseBatchModalVisible(true);
      return;
    }

    // This will check if there is more than one type of user ingredient if it does the selection will pop up, but if the first ingredient found has an expirty date it will open the selection modal as well
    if (matchingVariants.length === 1 && matchingVariants[0].expiry_date) {
      const match = matchingVariants[0];
      setSelectedUserIngredient(match);
      setSelectedUserIngredientId(match.id);
      setIsUpdateUserIngredientModalVisible(true);
      return;
    }
    setUserIngredient({
      userId: userId!,
      ingredientId: productInfo.Ing_id!,
      unitQuantity: 1,
      totalAmount: productInfo.Ing_quantity || 1,
      unitType: productInfo.Ing_quantity_units || "",
      expiry_date: "",
    });
    setIsAddUserIngredientModalVisible(true);
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
          expiry_date: "",
        });

        setScannedData(updatedIngredient);
        fetchUserIngredients();
      }

      setIsAddIngredientModalVisible(false);
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

  const handleAddUserIngredient = async (
    userIngredient: UserIngredientInput
  ): Promise<boolean> => {
    try {
      const allUserIngredients = await getUserIngredients(userId!);

      const isDuplicate = allUserIngredients.some(
        (item) =>
          item.ingredient.Ing_id === userIngredient.ingredientId &&
          (item.expiry_date ?? null) === (userIngredient.expiry_date ?? null)
      );

      if (isDuplicate) {
        return false;
      }

      await addUserIngredient(userIngredient);
      fetchUserIngredients();
      setIsAddUserIngredientModalVisible(false);
      return true;
    } catch (error) {
      console.error("Error adding user ingredient:", error);
      return false;
    }
  };

  return {
    scannedData,
    userIngredient,
    setUserIngredient,
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
