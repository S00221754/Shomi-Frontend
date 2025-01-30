import axiosInstance from "./api";


export const getIngredients = async () => {
    try {
        const response = await axiosInstance.get(`/ingredients`);
        return response.data;
    } catch (error) {
        throw error;
    }
}