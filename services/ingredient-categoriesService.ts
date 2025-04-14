import axiosInstance from "./api";

export const GetIngredientCategories = async () => {
  try {
    const response = await axiosInstance.get(`/ingredient-categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
