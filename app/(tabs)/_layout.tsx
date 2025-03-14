import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

export default function TabLayout() {
  const { theme } = useTheme(); // Get active theme

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerStyle: {
          backgroundColor: theme.colors.background, // Dynamic background color
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.white, // Dynamic text color
        tabBarStyle: {
          backgroundColor: theme.colors.background, // Dynamic tab bar color
        },
        tabBarInactiveTintColor: theme.colors.grey3, // Optional: tweak inactive tab color
      }}
    >
      <Tabs.Screen
        name="scanScreen"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "barcode" : "barcode-outline"} color={color} size={24} />
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
          title: "Pantry Storage",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "basket" : "basket-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipesScreen"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
