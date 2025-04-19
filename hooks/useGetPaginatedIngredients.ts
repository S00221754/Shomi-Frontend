import { useState, useEffect, useCallback } from "react";
import { getPaginatedIngredients } from "@/services/ingredientsService";
import { ProductInfo } from "@/Interfaces/ingredient";

export const usePaginatedIngredients = (initialPage = 1, limit = 10) => {
  const [data, setData] = useState<ProductInfo[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchIngredients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPaginatedIngredients(page, limit);
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
