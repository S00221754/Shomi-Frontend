// 📂 src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await SecureStore.setItemAsync("userToken", firebaseUser.uid); // Store user ID securely
        router.replace("/(tabs)"); // Redirect to home screen
      } else {
        setUser(null);
        await SecureStore.deleteItemAsync("userToken");
        router.replace("/login");
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await SecureStore.setItemAsync("userToken", userCredential.user.uid); // Store UID in SecureStore
      console.log("User logged in:", userCredential.user);
      
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      await SecureStore.deleteItemAsync("userToken");
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
