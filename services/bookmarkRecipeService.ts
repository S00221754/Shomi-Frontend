import { Recipe } from "@/Interfaces/recipe";
import axiosInstance from "./api";

export const getBookmarkRecipes = async (userId: string): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>(`/bookmarks/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBookmark = async (
  userId: string,
  recipeId: string
): Promise<void> => {
  try {
    await axiosInstance.post(`/bookmarks/`, {
      data: {
        userId,
        recipeId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const removeBookmark = async (
  userId: string,
  recipeId: string
): Promise<void> => {
  try {
    await axiosInstance.delete(`/bookmarks/`, {
      data: {
        userId,
        recipeId,
      },
    });
  } catch (error) {
    throw error;
  }
};
