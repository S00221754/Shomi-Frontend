import { useState } from "react";
import { useCameraPermissions } from "expo-camera";
import { getIngredientByBarcode, fetchIngredientFromAPI } from "../services/scanService";
import { ProductInfo } from "../Interfaces/ingredient";

export function useBarcodeScanner(onBarcodeScanned: (product: ProductInfo) => void, onStopScanning: () => void) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
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
        Ing_name: "",
        Ing_barcode: "",
        Ing_brand: "",
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
