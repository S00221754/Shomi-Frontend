import { useState } from "react";
import { addIngredient } from "@/services/ingredientsService";
import { ProductInfo } from "@/Interfaces/ingredient";

export const useAddIngredient = () => {
  const [loading, setLoading] = useState(false);

  const addNewIngredient = async (ingredient: ProductInfo) => {
    setLoading(true);
    try {
      await addIngredient(ingredient);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { addNewIngredient, loading };
};
