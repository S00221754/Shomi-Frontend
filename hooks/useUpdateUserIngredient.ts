import { useState, useEffect } from "react";
import { updateUserIngredient } from "@/services/user-ingredientService";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";

export const useUpdateUserIngredient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUserIngredient = async (userIngredientId: string, userIngredient: UserIngredientInput) => {
    setLoading(true);
    try {
      await updateUserIngredient(userIngredientId, userIngredient);
    } catch (error) {
      setError("Failed to update ingredient");
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUserIngredient, loading, error };
};
