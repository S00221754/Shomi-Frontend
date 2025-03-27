import { useState } from "react";
import { deleteUserIngredient } from "@/services/user-ingredientService";

export const useDeleteUserIngredient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteUserIngredient = async (userIngredientId: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserIngredient(userIngredientId);
    } catch (err) {
      setError("Failed to delete ingredient");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteUserIngredient, loading, error };
};
