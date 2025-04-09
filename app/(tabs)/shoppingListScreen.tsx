import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { CheckBox, Text, useTheme } from "@rneui/themed";

interface ShoppingItem {
  id: string;
  name: string;
}

const initialShoppingItems: ShoppingItem[] = [
  { id: "1", name: "Tomatoes" },
  { id: "2", name: "Milk" },
  { id: "3", name: "Bread" },
  { id: "4", name: "Eggs" },
];

const ShoppingListScreen = () => {
  const { theme } = useTheme();
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    // Reset to initial items on mount
    setShoppingItems(initialShoppingItems);
  }, []);

  const handleCheck = (id: string) => {
    setShoppingItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
        paddingHorizontal: 16,
      }}
    >
      <Text
        h4
        style={{
          color: theme.colors.primary,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        You're running low or out of the following ingredients
      </Text>
      {shoppingItems.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.grey2,
            fontSize: 16,
          }}
        >
          Your shopping list is empty
        </Text>
      ) : (
        <FlatList
          data={shoppingItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.colors.white,
                padding: 12,
                borderRadius: 16,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <CheckBox
                checked={false}
                onPress={() => handleCheck(item.id)}
                containerStyle={{
                  padding: 0,
                  marginRight: 12,
                  backgroundColor: "transparent",
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.black,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ShoppingListScreen;
