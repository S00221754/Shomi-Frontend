import { useState } from "react";

export const useScannerState = () => {
  const [scanningMode, setScanningMode] = useState<"None" | "Barcode" | "Receipt">("None");
  const [isAddIngredientModalVisible, setIsAddIngredientModalVisible] = useState(false);
  const [isAddUserIngredientModalVisible, setIsAddUserIngredientModalVisible] = useState(false);

  const closeIngredientModal = () => setIsAddIngredientModalVisible(false);
  const closeUserIngredientModal = () => setIsAddUserIngredientModalVisible(false);

  return {
    scanningMode,
    isAddIngredientModalVisible,
    isAddUserIngredientModalVisible,
    closeIngredientModal,
    closeUserIngredientModal,
    setIsAddIngredientModalVisible,
    setIsAddUserIngredientModalVisible,
  };
};
