import { useState, useEffect } from "react";
import { getIngredientByBarcode } from "@/services/ingredientsService";

export const useGetIngredientByBarcode = (barcode: string) => {
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      setLoading(true);
      try {
        const data = await getIngredientByBarcode(barcode);
        setIngredient(data);
      } catch (err) {
        setError("Failed to fetch ingredient");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [barcode]);

  return { ingredient, loading, error };
};
