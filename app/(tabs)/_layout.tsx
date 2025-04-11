import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, useTheme, Overlay, ListItem } from "@rneui/themed";
import { View } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/common/Logo";
import { useEffect } from "react";
import { getExpoPushToken } from "@/utils/notification";
import { updateExpoPushToken } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const { theme } = useTheme();
  const { toggleTheme, isDarkMode } = useAppTheme();
  const [showSettings, setShowSettings] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const registerPush = async () => {
      if (!user?.id) return;

      const token = await getExpoPushToken();
      if (!token) return;

      try {
        const savedToken = await AsyncStorage.getItem("expo_push_token");
        const savedUserId = await AsyncStorage.getItem(
          "expo_push_token_user_id"
        );

        const shouldUpdateToken =
          savedToken !== token || savedUserId !== user.id;

        if (!shouldUpdateToken) {
          return;
        }

        await updateExpoPushToken(user.id, token);
        await AsyncStorage.setItem("expo_push_token", token);
        await AsyncStorage.setItem("expo_push_token_user_id", user.id);
      } catch (err) {
        console.error("Failed to update expo push token:", err);
      }
    };

    registerPush();
  }, [user?.id]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "expo_push_token",
      "expo_push_token_user_id",
    ]);
    await supabase.auth.signOut();
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: true,
          headerTintColor: theme.colors.primary,
          tabBarStyle: { backgroundColor: theme.colors.background },
          tabBarInactiveTintColor:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,

          headerLeft: () => (
            <View style={{ marginLeft: 12 }}>
              <Logo width={40} height={40} />
            </View>
          ),

          headerTitleAlign: "center",

          headerRight: () => (
            <Button
              type="clear"
              onPress={() => setShowSettings((prev) => !prev)}
              icon={
                <Icon
                  name="settings"
                  type="feather"
                  color={theme.colors.primary}
                  size={22}
                />
              }
              buttonStyle={{ marginRight: 10 }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="recipesScreen"
          options={{
            title: "Recipes",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Pantry",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "basket" : "basket-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="shoppingListScreen"
          options={{
            title: "Shopping List",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>

      {/* Settings Dropdown as Overlay */}
      <Overlay
        isVisible={showSettings}
        onBackdropPress={() => setShowSettings(false)}
        backdropStyle={{ backgroundColor: "transparent" }}
        overlayStyle={{
          position: "absolute",
          top: 60,
          right: 10,
          width: 180,
          padding: 0,
          borderRadius: 10,
          backgroundColor:
            theme.mode === "dark"
              ? theme.colors.grey3
              : theme.colors.background,
          borderColor: theme.colors.grey0,
          borderWidth: theme.mode === "dark" ? 1 : 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <>
          <ListItem
            onPress={() => {
              toggleTheme();
              setShowSettings(false);
            }}
            bottomDivider
          >
            <Icon
              name={isDarkMode ? "sunny" : "moon"}
              type="ionicon"
              color={theme.colors.primary}
            />
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color:
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black,
                }}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <ListItem
            onPress={async () => {
              await handleLogout();
              setShowSettings(false);
            }}
          >
            <Icon name="log-out" type="feather" color="red" />
            <ListItem.Content>
              <ListItem.Title style={{ color: "red" }}>Log Out</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </>
      </Overlay>
    </>
  );
}
