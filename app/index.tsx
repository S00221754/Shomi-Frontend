import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) return null;

  return <Redirect href={isLoggedIn ? "/(tabs)" : "/login"} />;
}
