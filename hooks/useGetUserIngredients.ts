import { useState, useEffect } from "react";
import { getUserIngredients } from "@/services/user-ingredientService";
import { UserIngredient } from "@/types/ingredient";

export const useGetUserIngredients = (userId: string) => {
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserIngredients = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserIngredients(userId);
      setUserIngredients(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIngredients();
  }, [userId]);

  return { userIngredients, loading, fetchUserIngredients };
};
