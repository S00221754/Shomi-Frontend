import { Recipe } from "@/Interfaces/recipe";
import axiosInstance from "./api";

export const getBookmarkRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>(`/bookmarks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBookmark = async (recipeId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/bookmarks`, {
      recipeId,
    });
  } catch (error) {
    throw error;
  }
};

export const removeBookmark = async (recipeId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/bookmarks`, {
      data: { recipeId },
    });
  } catch (error) {
    throw error;
  }
};
