import { ProductInfo } from "@/types/ingredient";
import axiosInstance from "./api";


export const getIngredients = async () => {
    try {
        const response = await axiosInstance.get(`/ingredient`);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addIngredient = async (ingredient: ProductInfo) => {
    try {
        const response = await axiosInstance.post(`/ingredient`, ingredient);
        return response.data;
    } catch (error) {
        throw error;
    }
}