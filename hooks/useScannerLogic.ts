import { useState } from "react";
import { ProductInfo, UserIngredient } from "../Interfaces/ingredient";
import { addIngredient } from "../services/ingredientsService";
import { useAuth } from "@/providers/AuthProvider";
import {
  addUserIngredient,
  getUserIngredients,
} from "@/services/user-ingredientService";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { deleteShoppingListItem } from "@/services/shoppingListService";

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

  const router = useRouter();
  const { action, shopId } = useLocalSearchParams();

  const handleBarcodeScanned = async (productInfo: ProductInfo) => {
    let resolvedIngredient = productInfo;

    // If it's not in DB or missing ID and not in database, we add it
    if (!productInfo.In_Database || !productInfo.Ing_id) {
      const missingFields = getMissingFields(productInfo);

      if (missingFields.length > 0) {
        setScannedData(productInfo);
        setIsAddIngredientModalVisible(true);
        return;
      }

      try {
        const newIngredient = await addIngredient(productInfo);
        if (newIngredient) {
          resolvedIngredient = {
            ...newIngredient,
            Ing_units: newIngredient.Ing_quantity_units,
            In_Database: true,
            status: true,
          };
        } else {
          console.error("Failed to save ingredient to DB.");
          return;
        }
      } catch (error) {
        console.error("Error adding ingredient:", error);
        return;
      }
    }

    setScannedData(resolvedIngredient);

    const matchingVariants = userIngredients.filter(
      (item) => item.ingredient.Ing_id === resolvedIngredient.Ing_id
    );

    if (matchingVariants.length > 1) {
      setMatchingIngredientVariants(matchingVariants);
      setIsChooseBatchModalVisible(true);
      return;
    }

    if (matchingVariants.length === 1) {
      const match = matchingVariants[0];
      setSelectedUserIngredient(match);
      setSelectedUserIngredientId(match.id);
      setIsUpdateUserIngredientModalVisible(true);
      return;
    }

    setUserIngredient({
      userId: userId!,
      ingredientId: resolvedIngredient.Ing_id!,
      unitQuantity: 1,
      totalAmount: resolvedIngredient.Ing_quantity || 1,
      unitType: resolvedIngredient.Ing_quantity_units || "",
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
          category_id: newIngredient.category_id,
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

      if (action === "restock" && typeof shopId === "string") {
        await deleteShoppingListItem(shopId);
      }

      router.replace("/(tabs)");
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

  if (
    !product.Ing_name ||
    product.Ing_name.trim() === "" ||
    product.Ing_name.toLowerCase().includes("not found")
  ) {
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

  if (!product.category?.id) {
    missing.push("Category");
  }

  return missing;
};
