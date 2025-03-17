import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, useTheme } from "@rneui/themed";
import { useAppTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme(); // Get active theme
  const { toggleTheme, isDarkMode } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: {
          backgroundColor: theme.colors.background, // Dynamic background colord
        },
        headerShadowVisible: true,
        headerTintColor: theme.colors.primary, // Dynamic text color
        tabBarStyle: {
          backgroundColor: theme.colors.background, // Dynamic tab bar color
        },
        tabBarInactiveTintColor: theme.mode === "dark" ? theme.colors.white : theme.colors.black, // Dynamic inactive tab color
        headerRight: () => (
          <Button
            type="clear"
            onPress={toggleTheme}
            icon={
              <Icon
                name={isDarkMode ? "sunny" : "moon"}
                type="ionicon"
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
            <Ionicons name={focused ? "book" : "book-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantryScreen"
        options={{
          title: "Pantry",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "basket" : "basket-outline"} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
