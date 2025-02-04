import { useState } from "react";
import { ProductInfo } from "../types/ingredient";
import { addIngredient } from "../services/ingredientsService";


export const useIngredientScanner = () => {
    const [scanningMode, setScanningMode] = useState<"None" | "Barcode" | "Receipt">("None");
    const [scannedData, setScannedData] = useState<ProductInfo | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleScanProduct = () => setScanningMode("Barcode");
    const handleStopScanning = () => setScanningMode("None");

    const closeModal = () => setIsModalVisible(false);

    const handleBarcodeScanned = async (productInfo: ProductInfo) => {
        setScannedData(productInfo);
        setIsModalVisible(true);
    };

    const handleAddIngredient = async (ingredient: ProductInfo, unitInput: string) => {
        if (!unitInput) return;
        ingredient.Ing_units = ingredient.Ing_units ? [...ingredient.Ing_units, unitInput] : [unitInput];

        try {
            await addIngredient(ingredient);
            closeModal();
        } catch (error) {
            console.error("Error adding ingredient:", error);
        }
    };

    return {
        scanningMode,
        scannedData,
        isModalVisible,
        handleScanProduct,
        handleStopScanning,
        closeModal,
        handleBarcodeScanned,
        handleAddIngredient,
    };
};
