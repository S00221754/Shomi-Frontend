import { useState, useEffect } from "react";
import { getIngredients } from "@/services/ingredientsService";
import { ProductInfo } from "@/Interfaces/ingredient";

export const useGetIngredient = () => {
  const [ingredients, setIngredients] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredients();
        setIngredients(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading };
};
