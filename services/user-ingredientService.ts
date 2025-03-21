import { UserIngredientInput, UserIngredientUpdate } from "@/types/user-ingredient";
import axiosInstance from "./api";
import { UserIngredient } from "@/types/ingredient";

export const getUserIngredients = async (userId : string): Promise<UserIngredient[]> => {
    try {
        const response = await axiosInstance.get<UserIngredient[]>(`/user-ingredient/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUserIngredient = async (userIngredientId : string) => {
    try {
        const response = await axiosInstance.delete(`/user-ingredient/${userIngredientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addUserIngredient = async (userIngredient: UserIngredientInput) => {
    try {
        const response = await axiosInstance.post(`/user-ingredient`, {
            userIngredient
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserIngredient = async (userIngredientId:string, userIngredient: UserIngredientUpdate) => {
    console.log("api call", userIngredient);
    
    try {
        const response = await axiosInstance.patch(`/user-ingredient/${userIngredientId}`, {
            userIngredient
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserIngredientByIngredientId = async (userId: string, ingredientId: number) => {
    try {
        const response = await axiosInstance.get<UserIngredient>(`/user-ingredient/${userId}/${ingredientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
