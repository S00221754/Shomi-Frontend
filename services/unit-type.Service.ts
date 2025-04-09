import axiosInstance from "./api";
import { UnitType } from "@/Interfaces/unit-type";

export const getUnitTypes = async (): Promise<UnitType[]> => {
  try {
    const response = await axiosInstance.get<UnitType[]>("/unit-types");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnitTypeById = async (id: string): Promise<UnitType> => {
  try {
    const response = await axiosInstance.get<UnitType>(`/unit-types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnitTypeByName = async (name: string): Promise<UnitType> => {
  try {
    const response = await axiosInstance.get<UnitType>(
      `/unit-types/name/${name}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUnitType = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/unit-types/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateUnitTypes = async (): Promise<void> => {
  try {
    await axiosInstance.patch("/unit-types");
  } catch (error) {
    throw error;
  }
};
