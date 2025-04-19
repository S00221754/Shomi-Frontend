import { UserIngredientInput, UserIngredientUpdate } from "@/Interfaces/user-ingredient";
import axiosInstance from "./api";
import { UserIngredient } from "@/Interfaces/ingredient";

export const getUserIngredients = async (userId: string): Promise<UserIngredient[]> => {
  try {
    const response = await axiosInstance.get<UserIngredient[]>(`/user-ingredient/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaginatedUserIngredients = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: UserIngredient[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axiosInstance.get(`/user-ingredient/paginated`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserIngredient = async (userIngredientIds: string[]) => {
  try {
    const response = await axiosInstance.delete(`/user-ingredient/`, {
      data: { userIngredientIds },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUserIngredient = async (userIngredient: UserIngredientInput) => {
  try {
    const response = await axiosInstance.post(`/user-ingredient`, {
      userIngredient,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserIngredient = async (userIngredientId: string, userIngredient: UserIngredientUpdate) => {
  try {
    const response = await axiosInstance.patch(`/user-ingredient/${userIngredientId}`, userIngredient);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserIngredientByIngredientId = async (userId: string, ingredientId: number) => {
  try {
    const response = await axiosInstance.get<UserIngredient>(`/user-ingredient/${userId}/${ingredientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const quickRestockUserIngredient = async (useringredientId: string) => {
  try {
    const response = await axiosInstance.patch(`/user-ingredient/${useringredientId}/quick-restock`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
