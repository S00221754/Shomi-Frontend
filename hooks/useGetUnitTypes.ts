import { useEffect, useState } from "react";
import { getUnitTypes } from "@/services/unit-type.Service";
import { UnitType } from "@/Interfaces/unit-type";

export const useGetUnitTypes = () => {
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        const data = await getUnitTypes();
        setUnitTypes(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitTypes();
  }, []);

  return {
    unitTypes,
    loading,
    error,
  };
};
