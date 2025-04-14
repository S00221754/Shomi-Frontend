import { useEffect, useState } from "react";
import axiosInstance from "@/services/api";
import { IngredientCategory } from "@/Interfaces/ingredient-category";

export const useGetIngredientCategories = () => {
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/ingredient-categories");
        setCategories(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
