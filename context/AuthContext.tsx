import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/authService";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

// Define Auth Context Type
interface AuthContextType {
  userToken: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load token and userId on startup
  useEffect(() => {
    const loadAuthData = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      const id = await SecureStore.getItemAsync("userId");

      if (token && id) {
        setUserToken(token);
        setUserId(id);
        router.replace("/(tabs)"); // Navigate to home if token exists
      } else {
        router.replace("/login"); // Navigate to login if no token
      }
      setIsLoading(false);
    };
    loadAuthData();
  }, []);

  // Login Function
  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      setUserToken(response.token);
      setUserId(response.user.id);
      router.replace("/(tabs)");
    } catch (error) {
      alert(error);
    }
  };

  // Logout Function
  const logout = async () => {
    await logoutUser();
    setUserToken(null);
    setUserId(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ userToken, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
