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
import { router } from "expo-router";
import {
  getUserIngredients,
  updateUserIngredient,
} from "@/services/user-ingredientService";

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
          const result = await getShoppingList();
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

  const handleMarkAsBought = async (item: ShoppingItem) => {
    const allUserIngredients = await getUserIngredients(userId!);

    const matchingVariants = allUserIngredients.filter(
      (ui) => ui.ingredient.Ing_id === item.ingredient.Ing_id
    );

    // if there is more than one variant, go to the restock screen because the logic for batches is there
    if (matchingVariants.length > 1) {
      router.push({
        pathname: "/(tabs)",
        params: {
          action: "restock",
          ingredientId: item.ingredient.Ing_id,
          quantity: item.Shop_quantity,
          ingredientName: item.ingredient.Ing_name,
          shopId: item.Shop_id,
        },
      });
      return;
    }

    // automatically restock the item if there is only one variant
    const pantryItem = matchingVariants[0];
    const updated = {
      unitQuantity: pantryItem.unitQuantity + item.Shop_quantity,
      totalAmount:
        (pantryItem.unitQuantity + item.Shop_quantity) *
        (item.ingredient.Ing_quantity || 1),
      unitType: pantryItem.unitType,
      expiry_date: pantryItem.expiry_date || null,
    };

    await updateUserIngredient(pantryItem.id, updated);
    await deleteShoppingListItem(item.Shop_id);

    setShoppingItems((prev) =>
      prev.filter((si) => si.Shop_id !== item.Shop_id)
    );

    showToast("success", "Restocked", `${item.ingredient.Ing_name} updated`);
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
                        onPress={() => handleMarkAsBought(item)}
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
