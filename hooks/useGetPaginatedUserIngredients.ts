import { useState, useEffect, useCallback } from "react";
import { getPaginatedUserIngredients } from "@/services/user-ingredientService";
import { UserIngredient } from "@/Interfaces/ingredient";

export const usePaginatedUserIngredients = (initialPage = 1, limit = 10) => {
  const [data, setData] = useState<UserIngredient[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPaginatedUserIngredients(page, limit);
      setData(res.data);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      console.error("Error fetching paginated ingredients:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return {
    data,
    page,
    totalPages,
    totalItems,
    loading,
    setPage,
    refetch: fetchIngredients,
  };
};
