import React, { useEffect, useState } from "react";
import { View, ScrollView, TextInput, StyleSheet } from "react-native";
import { ListItem, Button, useTheme, Text, SearchBar } from "@rneui/themed";
import { getIngredients } from "@/services/ingredientsService";
import {
  addUserIngredient,
  getUserIngredients,
} from "@/services/user-ingredientService";
import { ProductInfo } from "@/Interfaces/ingredient";
import { UserIngredientInput } from "@/Interfaces/user-ingredient";
import UserIngredientModal from "@/components/modals/UserIngredientModal";
import { useAuth } from "@/providers/AuthProvider";
import { showToast } from "@/utils/toast";

const IngredientList = () => {
  const { userId } = useAuth();
  const { theme } = useTheme();
  const [ingredients, setIngredients] = useState<ProductInfo[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<ProductInfo[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<ProductInfo | null>(null);
  const [userIngredient, setUserIngredient] =
    useState<UserIngredientInput | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredients();
        setIngredients(data);
        setFilteredIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = ingredients.filter((item) =>
      item.Ing_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredIngredients(filtered);
  };

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
