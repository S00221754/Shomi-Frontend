
import { useState } from "react";
import { useCameraPermissions } from "expo-camera";
import { getIngredientByBarcode, fetchIngredientFromAPI } from "../services/scanService";
import { ProductInfo } from "../types/ingredient";

export function useBarcodeScanner(onBarcodeScanned: (product: ProductInfo) => void, onStopScanning: () => void) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true);
        console.log("Barcode scanned:", data);

        try {
            // First, check if the ingredient exists in the database
            const dbResponse = await getIngredientByBarcode(data);
            if (dbResponse) {
                onBarcodeScanned({ ...dbResponse, status: true, In_Database: true });
                return;
            }

            const apiResponse = await fetchIngredientFromAPI(data);
            onBarcodeScanned(apiResponse);
        } catch (error) {
            console.error("Error scanning barcode:", error);
            onBarcodeScanned({
                Ing_name: "Product not found",
                Ing_barcode: "Product not found",
                Ing_brand: "Product not found",
                status: false,
                In_Database: false,
            });
        } finally {
            onStopScanning();
        }
    };

    return {
        permission,
        requestPermission,
        scanned,
        handleBarCodeScanned,
    };
}
