import React from "react";
import { View, Text, Pressable } from "react-native";
import { ListItem, CheckBox, Icon, useTheme } from "@rneui/themed";
import { UserIngredient } from "@/Interfaces/ingredient";
import { renderExpiryBadge, renderQuantityBadge } from "./PantryHelper"; // Import helper functions
import ShomiButton from "../common/ShomiButton";

interface PantryItemProps {
  item: UserIngredient;
  isSelected: boolean;
  toggleIngredientSelection: (ingredientId: string, isChecked: boolean) => void;
  isExpanded: boolean;
  toggleRowExpansion: (ingredientId: string) => void;
  handleAddToShoppingList: (item: UserIngredient) => Promise<void>;
  handleDeletePress: (id: string) => void;
  handleEditPress: (item: UserIngredient) => void;
}

const PantryItem: React.FC<PantryItemProps> = ({
  item,
  isSelected,
  toggleIngredientSelection,
  isExpanded,
  toggleRowExpansion,
  handleAddToShoppingList,
  handleDeletePress,
  handleEditPress,
}) => {
  const { theme } = useTheme();

  return (
    <View
      key={item.id}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.greyOutline,
        backgroundColor:
          theme.mode === "dark" ? theme.colors.black : theme.colors.white,
      }}
    >
      <ListItem.Accordion
        content={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              paddingVertical: 10,
            }}
          >
            <Pressable
              onPress={() => toggleIngredientSelection(item.id, !isSelected)}
              style={{ padding: 7 }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <CheckBox
                  checked={isSelected}
                  onPress={() =>
                    toggleIngredientSelection(item.id, !isSelected)
                  }
                  checkedColor={theme.colors.primary}
                  uncheckedColor={
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.greyOutline
                  }
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    padding: 0,
                  }}
                  size={32}
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                />
              </View>
            </Pressable>

            <View
              style={{
                flex: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme.mode === "dark"
                          ? theme.colors.white
                          : theme.colors.black,
                    }}
                  >
                    {item.ingredient.Ing_name}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {item.expiry_date && renderExpiryBadge(item.expiry_date)}
              {item.ingredient?.Ing_quantity != null &&
                renderQuantityBadge(
                  item.totalAmount,
                  item.ingredient.Ing_quantity
                )}
            </View>

            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              type="material-community"
              color={
                theme.mode === "dark" ? theme.colors.white : theme.colors.black
              }
              size={24}
            />
          </View>
        }
        containerStyle={{
          backgroundColor:
            theme.mode === "dark" ? theme.colors.black : theme.colors.white,
        }}
        isExpanded={isExpanded}
        onPress={() => toggleRowExpansion(item.id)}
        expandIcon={{
          name: "chevron-down",
          type: "material-community",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          size: 24,
        }}
        noIcon={true}
      >
        <View
          style={{
            padding: 10,
            backgroundColor:
              theme.mode === "dark" ? theme.colors.black : theme.colors.white,
            borderRadius: 5,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 4,
              marginBottom: 8,
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="scale-balance"
                  type="material-community"
                  size={18}
                  color={
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color:
                      theme.mode === "dark"
                        ? theme.colors.white
                        : theme.colors.black,
                    fontSize: 14,
                  }}
                >
                  Quantity:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.mode === "dark"
                          ? theme.colors.white
                          : theme.colors.black,
                    }}
                  >
                    {item.unitQuantity || "N/A"}
                  </Text>
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="package-variant"
                  type="material-community"
                  size={18}
                  color={
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color:
                      theme.mode === "dark"
                        ? theme.colors.white
                        : theme.colors.black,
                    fontSize: 14,
                  }}
                >
                  Amount:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.mode === "dark"
                          ? theme.colors.white
                          : theme.colors.black,
                    }}
                  >
                    {item.totalAmount || "Unknown"} {item.unitType || ""}
                  </Text>
                </Text>
              </View>
            </View>

            {item.expiry_date && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="calendar-clock"
                  type="material-community"
                  size={18}
                  color={
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color:
                      theme.mode === "dark"
                        ? theme.colors.white
                        : theme.colors.black,
                    fontSize: 14,
                  }}
                >
                  Expiry:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        theme.mode === "dark"
                          ? theme.colors.white
                          : theme.colors.black,
                    }}
                  >
                    {item.expiry_date}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 16,
              marginTop: 8,
            }}
          >
            {[
              {
                title: "Add to List",
                icon: "cart-plus",
                color: theme.colors.primary,
                onPress: () => handleAddToShoppingList(item),
              },
              {
                title: "Edit",
                icon: "pencil",
                color: theme.colors.warning,
                onPress: () => handleEditPress(item),
              },
              {
                title: "Delete",
                icon: "delete",
                color: theme.colors.error,
                onPress: () => handleDeletePress(item.id),
              },
            ].map((btn, idx) => (
              <View style={{ flex: 1 }} key={idx}>
                <ShomiButton
                  title={btn.title}
                  icon={btn.icon}
                  buttonStyle={{
                    backgroundColor: btn.color,
                    minHeight: 48,
                  }}
                  titleStyle={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                  onPress={btn.onPress}
                />
              </View>
            ))}
          </View>
        </View>
      </ListItem.Accordion>
    </View>
  );
};

export default PantryItem;
