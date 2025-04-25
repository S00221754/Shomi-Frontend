import axios from "axios";
import { API_URL } from "@/constants/constants";
import { supabase } from "@/lib/supabase";

// This file contains the axios instance with interceptors for authentication and error handling.
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn("Failed to attach auth token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    if (status === 401) {
      console.warn("Unauthorized – maybe log out user or refresh token.");
    }

    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
