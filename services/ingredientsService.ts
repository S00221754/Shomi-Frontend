import { ProductInfo } from "@/Interfaces/ingredient";
import axiosInstance from "./api";

export const getIngredients = async () => {
  try {
    const response = await axiosInstance.get(`/ingredient`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaginatedIngredients = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{
  data: ProductInfo[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axiosInstance.get(`/ingredient/paginated`, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addIngredient = async (ingredient: ProductInfo) => {
  try {
    const response = await axiosInstance.post(`/ingredient`, ingredient);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIngredientByBarcode = async (barcode: string) => {
  try {
    const response = await axiosInstance.get(`/ingredient/barcode/${barcode}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getIngredientById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/ingredient/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
