import React, { useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import { Icon, Text, useTheme, ListItem } from "@rneui/themed";
import { deleteShoppingListItem, getShoppingList } from "@/services/shoppingListService";
import { useAuth } from "@/providers/AuthProvider";
import { ShoppingItem } from "@/Interfaces/shopping-list";
import { useToast } from "@/utils/toast";
import { useFocusEffect, router } from "expo-router";
import { getUserIngredients, updateUserIngredient } from "@/services/user-ingredientService";

const ShoppingListScreen = () => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const { showToast } = useToast();

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
    const matchingVariants = allUserIngredients.filter((ui) => ui.ingredient.Ing_id === item.ingredient.Ing_id);

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

    const pantryItem = matchingVariants[0];
    const updated = {
      unitQuantity: pantryItem.unitQuantity + item.Shop_quantity,
      totalAmount: (pantryItem.unitQuantity + item.Shop_quantity) * (item.ingredient.Ing_quantity || 1),
      unitType: pantryItem.unitType,
      expiry_date: pantryItem.expiry_date || null,
    };

    await updateUserIngredient(pantryItem.id, updated);
    await deleteShoppingListItem(item.Shop_id);
    setShoppingItems((prev) => prev.filter((si) => si.Shop_id !== item.Shop_id));
    showToast("success", "Restocked", `${item.ingredient.Ing_name} updated`);
  };

  const handleDismissItem = async (itemId: string) => {
    try {
      await deleteShoppingListItem(itemId);
      setShoppingItems((prev) => prev.filter((item) => item.Shop_id !== itemId));
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
            color: textColor,
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
                backgroundColor: isDark ? theme.colors.black : theme.colors.white,
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
                noIcon
                content={
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <ListItem.Content style={{ flex: 1 }}>
                      <ListItem.Title
                        style={{
                          fontWeight: "bold",
                          color: textColor,
                          fontSize: 16,
                        }}
                      >
                        {item.ingredient.Ing_name}
                      </ListItem.Title>
                    </ListItem.Content>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
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
                      <Icon
                        name={expandedItems[item.Shop_id] ? "chevron-up" : "chevron-down"}
                        type="material-community"
                        color={textColor}
                        size={24}
                      />
                    </View>
                  </View>
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
                  <Text style={{ color: textColor, fontSize: 14 }}>
                    Reason: <Text style={{ fontWeight: "bold", color: textColor }}>{item.Shop_reason || "N/A"}</Text>
                  </Text>
                  <Text style={{ color: textColor, fontSize: 14 }}>
                    Quantity: <Text style={{ fontWeight: "bold", color: textColor }}>{item.Shop_quantity}</Text>
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
