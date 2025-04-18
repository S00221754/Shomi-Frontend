import axiosInstance from "./api";
import {
  Recipe,
  Ingredient,
  RecipeDTO,
  IngredientsToDeduct,
} from "@/Interfaces/recipe";
import { DeductionPreview } from "@/Interfaces/recipe";

export const getRecipes = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Recipe[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axiosInstance.get(`/recipes`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  try {
    const response = await axiosInstance.get<Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecommendedRecipes = async (
  selectedIngredients: string[] = []
): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.post<Recipe[]>(
      `/recipes/recommended`,
      { selectedIngredients }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRecipe = async (payload: RecipeDTO): Promise<Recipe> => {
  try {
    const response = await axiosInstance.post<Recipe>("/recipes", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (
  recipeId: string,
  recipe: RecipeDTO
): Promise<Recipe> => {
  try {
    const response = await axiosInstance.patch<Recipe>(
      `/recipes/${recipeId}`,
      recipe
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecipeDeductionPreview = async (
  recipeId: string
): Promise<DeductionPreview[]> => {
  try {
    const response = await axiosInstance.post<DeductionPreview[]>(
      `/recipes/${recipeId}/deduction-preview`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markRecipeAsCooked = async (
  recipeId: string,
  deductions: IngredientsToDeduct[]
) => {
  try {
    const response = await axiosInstance.post(`/recipes/${recipeId}/cooked`, {
      deductions,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking recipe as cooked:", error);
    throw error;
  }
};
