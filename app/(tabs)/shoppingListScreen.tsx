import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList } from "react-native";
import { CheckBox, Icon, Text, useTheme, ListItem } from "@rneui/themed";
import {
  deleteShoppingListItem,
  getShoppingList,
  markItemAsPurchased,
} from "@/services/shoppingListService";
import { useAuth } from "@/providers/AuthProvider";
import { ShoppingItem } from "@/Interfaces/shopping-list";
import { showToast } from "@/utils/toast";
import { useFocusEffect } from "expo-router";

const ShoppingListScreen = () => {
  const { theme } = useTheme();
  const { userId } = useAuth();
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const fetchItems = async () => {
        try {
          const result = await getShoppingList(userId);
          setShoppingItems(result);
        } catch (error) {
          console.error("Failed to load shopping list");
        }
      };

      fetchItems();
    }, [userId])
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMarkAsBought = async (itemId: string) => {
    try {
      await markItemAsPurchased(itemId);
      setShoppingItems((prev) =>
        prev.filter((item) => item.Shop_id !== itemId)
      );
      showToast("success", "Purchased", "Item added to your pantry.");
    } catch (error) {
      console.error("Failed to mark item as purchased:", error);
      showToast("error", "Error", "Could not mark item as purchased.");
    }
  };

  const handleDismissItem = async (itemId: string) => {
    try {
      await deleteShoppingListItem(itemId);
      setShoppingItems((prev) =>
        prev.filter((item) => item.Shop_id !== itemId)
      );
      showToast("success", "Dismissed", "Item removed from shopping list.");
    } catch (error) {
      console.error("Failed to delete item:", error);
      showToast("error", "Error", "Could not remove item.");
    }
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
          keyExtractor={(item) => item.Shop_id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 16,
                borderRadius: 16,
                backgroundColor: theme.colors.white,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
                overflow: "hidden",
              }}
            >
              <ListItem.Accordion
                isExpanded={!!expandedItems[item.Shop_id]}
                onPress={() => toggleExpand(item.Shop_id)}
                containerStyle={{
                  backgroundColor: "transparent",
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                }}
                content={
                  <>
                    <ListItem.Content>
                      <ListItem.Title
                        style={{
                          fontWeight: "bold",
                          color: theme.colors.black,
                          fontSize: 16,
                        }}
                      >
                        {item.ingredient.Ing_name}
                      </ListItem.Title>
                    </ListItem.Content>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <Icon
                        name="check-circle-outline"
                        type="material-community"
                        color={theme.colors.success}
                        size={26}
                        onPress={() => handleMarkAsBought(item.Shop_id)}
                      />
                      <Icon
                        name="close-circle-outline"
                        type="material-community"
                        color={theme.colors.error}
                        size={26}
                        onPress={() => handleDismissItem(item.Shop_id)}
                      />
                    </View>
                  </>
                }
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    paddingHorizontal: 16,
                    paddingBottom: 12,
                    paddingTop: 4,
                  }}
                >
                  <Text style={{ color: theme.colors.grey1, fontSize: 14 }}>
                    Reason:{" "}
                    <Text
                      style={{ fontWeight: "bold", color: theme.colors.black }}
                    >
                      {item.Shop_reason || "N/A"}
                    </Text>
                  </Text>
                  <Text style={{ color: theme.colors.grey1, fontSize: 14 }}>
                    Quantity:{" "}
                    <Text
                      style={{ fontWeight: "bold", color: theme.colors.black }}
                    >
                      {item.Shop_quantity}
                    </Text>
                  </Text>
                </View>
              </ListItem.Accordion>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ShoppingListScreen;
