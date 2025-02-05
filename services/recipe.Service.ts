import axiosInstance from "./api";
import { Recipe, Ingredient } from "@/types/recipe";

export const getRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await axiosInstance.get<Recipe[]>(`/recipes`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
