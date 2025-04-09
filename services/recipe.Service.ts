import axiosInstance from "./api";
import { Recipe, Ingredient, RecipeDTO } from "@/Interfaces/recipe";

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>(`/recipes`);
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
  userId: string,
  selectedIngredients: string[] = []
): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.post<Recipe[]>(
      `/recipes/recommended/${userId}`,
      {
        selectedIngredients,
      }
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
