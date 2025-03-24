import axiosInstance from "./api";
import axios from "axios";
import { ProductInfo } from "../types/ingredient";

// fetch ingredient info from database
export const getIngredientByBarcode = async (barcode: string): Promise<ProductInfo | null> => {
    try {
        const response = await axiosInstance.get(`/ingredient/barcode/${barcode}`);  
        return response.data;
    } catch (error) {
        console.error("Database lookup failed:", error);
        return null;
    }
};

// uses openfoodfacts API to fetch ingredient info
export const fetchIngredientFromAPI = async (barcode: string): Promise<ProductInfo> => {
    try {
        const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        const response = await axios.get(apiUrl);

        if (response.data.status === 1) {
            return {
                Ing_barcode: barcode,
                Ing_name: response.data.product.product_name || "Unknown",
                Ing_brand: response.data.product.brands || "Unknown",
                Ing_keywords: response.data.product._keywords || ["Unknown"],
                Ing_quantity: response.data.product.product_quantity || 0,
                Ing_quantity_units: response.data.product.product_quantity_unit || "",
                status: true,
                In_Database: false,
            };
        }
        return { Ing_name: "Product not found", Ing_barcode: barcode, status: false, In_Database: false };
    } catch (error) {
        console.error("API fetch error:", error);
        return { Ing_name: "Product not found", Ing_barcode: barcode, status: false, In_Database: false };
    }
};
