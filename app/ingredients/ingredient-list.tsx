import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { ListItem, Button, useTheme, Text, SearchBar } from "@rneui/themed";
import {
  addUserIngredient,
  getUserIngredients,
} from "@/services/user-ingredientService";
import { ProductInfo } from "@/Interfaces/ingredient";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import UserIngredientModal from "@/components/modals/UserIngredientModal";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/utils/toast";
import { usePaginatedIngredients } from "@/hooks/useGetPaginatedIngredients";
import ShomiButton from "@/components/common/ShomiButton";

const IngredientList = () => {
  const { userId } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<ProductInfo | null>(null);
  const [userIngredient, setUserIngredient] =
    useState<UserIngredientInput | null>(null);
  const [search, setSearch] = useState("");

  const {
    data: ingredients,
    page,
    totalPages,
    loading,
    setPage,
    refetch,
  } = usePaginatedIngredients();

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const filteredIngredients = ingredients.filter((item) =>
    item.Ing_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = async (ingredient: ProductInfo) => {
    const newUserIngredient: UserIngredientInput = {
      userId: userId!,
      ingredientId: ingredient.Ing_id!,
      unitQuantity: 0,
      unitType: ingredient.Ing_quantity_units ?? "",
      totalAmount: 0,
      expiry_date: "",
    };

    setSelectedIngredient(ingredient);
    setUserIngredient(newUserIngredient);
    setModalVisible(true);
  };

  const handleAddUserIngredient = async (
    data: UserIngredientInput
  ): Promise<boolean> => {
    try {
      const allUserIngredients = await getUserIngredients(userId!);

      const isDuplicate = allUserIngredients.some(
        (item) =>
          item.ingredient.Ing_id === data.ingredientId &&
          (item.expiry_date ?? null) === (data.expiry_date ?? null)
      );

      if (isDuplicate) return false;

      await addUserIngredient(data);
      setModalVisible(false);
      showToast(
        "success",
        "Added to Pantry",
        `${selectedIngredient?.Ing_name} added successfully.`
      );
      return true;
    } catch (error) {
      console.error("Failed to add ingredient:", error);
      showToast("error", "Failed to add", "Please try again later.");
      return false;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SearchBar
        placeholder="Search ingredients..."
        onChangeText={handleSearch}
        value={search}
        round
        lightTheme={theme.mode === "light"}
        inputStyle={{
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
        }}
        inputContainerStyle={{
          backgroundColor:
            theme.mode === "dark" ? theme.colors.grey0 : theme.colors.white,
          borderRadius: 10,
        }}
        containerStyle={{
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          paddingHorizontal: 0,
          marginBottom: 10,
        }}
        placeholderTextColor={theme.colors.grey3}
      />

      <ScrollView>
        {filteredIngredients.map((item, index) => (
          <ListItem
            key={index}
            bottomDivider
            containerStyle={{
              backgroundColor:
                theme.mode === "dark" ? theme.colors.black : theme.colors.white,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color:
                    theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black,
                }}
              >
                {item.Ing_name}
              </ListItem.Title>
              <ListItem.Subtitle
                style={{
                  color:
                    theme.mode === "dark"
                      ? theme.colors.grey3
                      : theme.colors.black,
                }}
              >
                {item.Ing_brand}
              </ListItem.Subtitle>
            </ListItem.Content>
            <Button
              title="Add"
              onPress={() => handleOpenModal(item)}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              }}
              titleStyle={{ color: theme.colors.white }}
            />
          </ListItem>
        ))}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <ShomiButton
            icon="chevron-left"
            disabled={page === 1}
            onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            type="clear"
          />

          <Text
            style={{
              alignSelf: "center",
              marginHorizontal: 10,
              color:
                theme.mode === "dark" ? theme.colors.white : theme.colors.black,
            }}
          >
            Page {page} of {totalPages}
          </Text>

          <ShomiButton
            icon="chevron-right"
            disabled={page === totalPages}
            onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            type="clear"
          />
        </View>
      </ScrollView>

      <UserIngredientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userIngredient={userIngredient}
        onAddUserIngredient={handleAddUserIngredient}
        ingredient={selectedIngredient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default IngredientList;
