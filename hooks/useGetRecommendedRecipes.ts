import { useState, useEffect } from "react";
import { getRecommendedRecipes } from "@/services/recipe.Service";
import { Recipe } from "@/Interfaces/recipe";

export const useGetRecommendedRecipes = (userId: string) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecommendedRecipes(userId);
        setRecipes(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  return { recipes, loading };
};
