import axiosInstance from "./api";
import { ShoppingItem, ShoppingItemInput } from "@/Interfaces/shopping-list";

export const addShoppingListItem = async (
  shoppingListItem: ShoppingItemInput
): Promise<ShoppingItem> => {
  try {
    const response = await axiosInstance.post(
      "/shopping-list",
      shoppingListItem
    );
    return response.data;
  } catch (error) {
    console.error("Error adding shopping list item:", error);
    throw error;
  }
};

export const getShoppingList = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/shopping-list/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    throw error;
  }
};

export const updateShoppingListItem = async (
  itemId: string,
  updatedItem: Partial<ShoppingItem>
) => {
  try {
    const response = await axiosInstance.patch(
      `/shopping-list/${itemId}`,
      updatedItem
    );
    return response.data;
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    throw error;
  }
};

export const deleteShoppingListItem = async (itemId: string) => {
  try {
    const response = await axiosInstance.delete(`/shopping-list/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shopping list item:", error);
    throw error;
  }
};

export const markItemAsPurchased = async (itemId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/shopping-list/mark-bought/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking item as purchased:", error);
    throw error;
  }
};
