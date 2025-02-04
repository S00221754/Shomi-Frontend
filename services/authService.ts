import axiosInstance from "./api";
import * as SecureStore from "expo-secure-store";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/user-account/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    await SecureStore.setItemAsync("userToken", token);
    await SecureStore.setItemAsync("userId", user.id); // change this after demo

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync("userToken");
};
