import React, { useCallback, useState } from "react";
import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Text, Button, Card, ListItem, Icon, CheckBox } from "@rneui/themed";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";

const Pantry: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { userIngredients, loading, fetchUserIngredients } = useGetUserIngredients(user?.uid || "");
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

  const handleDeletePress = (id: string) => {
    setSelectedIngredientId(id);
    setModalVisible(true);
  };

  const toggleIngredientSelection = (ingredientId: string, isChecked: boolean) => {
    setSelectedIngredients(prev =>
      isChecked ? [...prev, ingredientId] : prev.filter(id => id !== ingredientId)
    );
  };

  const toggleRowExpansion = (ingredientId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  const handleConfirmDelete = async () => {
    if (selectedIngredientId) {
      await handleDeleteUserIngredient(selectedIngredientId);
      setModalVisible(false);
      fetchUserIngredients();
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserIngredients();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 10 }}>
      <Button
        title="Recommend Recipes"
        buttonStyle={{
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
          paddingVertical: 12,
          marginBottom: 15,
        }}
        titleStyle={{ color: theme.colors.white, fontSize: 16, fontWeight: "bold" }}
        onPress={() => {
          const selectedIngIds = userIngredients
            .filter((item) => selectedIngredients.includes(item.id))
            .map((item) => item.ingredient.Ing_id.toString());
          router.push({
            pathname: "/recipes/recommendedRecipesScreen",
            params: { selectedIngredients: JSON.stringify(selectedIngIds) },
          });
        }}
      />

      {userIngredients.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", marginTop: 20, color: theme.colors.black }}>
          No ingredients in your pantry
        </Text>
      ) : (
        <ScrollView stickyHeaderIndices={[0]}>
          {/* 🔹 Sticky Header */}
          <View style={{ backgroundColor: theme.colors.grey4 }}>
            <View
              style={{
                flexDirection: "row",
                padding: 12,
                paddingRight: 60, //this is to keep the headers aligned with the content
                backgroundColor: theme.colors.grey4,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.greyOutline,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>Select</Text>
              </View>
              <View style={{ flex: 2, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>Name</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>Amount</Text>
              </View>
            </View>
          </View>

          {/* 🔹 Table Rows with Accordion */}
          {userIngredients.map((item) => (
            <ListItem.Accordion
              key={item.id}
              content={
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  {/* Checkbox */}
                  <Pressable onPress={() => toggleIngredientSelection(item.id, !selectedIngredients.includes(item.id))} style={{ padding: 7, }}>
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
                      <CheckBox
                        checked={selectedIngredients.includes(item.id)}
                        onPress={() => toggleIngredientSelection(item.id, !selectedIngredients.includes(item.id))}
                        checkedColor={theme.colors.primary}
                        uncheckedColor={theme.colors.greyOutline}
                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }} // ✅ No background
                        size={32} // ✅ Bigger Checkbox
                        iconType="material-community" // ✅ Uses Material Community Icons
                        checkedIcon="checkbox-marked" // ✅ Filled Checkbox Icon
                        uncheckedIcon="checkbox-blank-outline" // ✅ Empty Checkbox Icon
                      />
                    </View>
                  </Pressable>

                  {/* Ingredient Name */}
                  <View style={{ flex: 2, alignItems: "center" }}>
                    <Text style={{ color: theme.colors.black }}>{item.ingredient.Ing_name}</Text>
                  </View>

                  {/* Amount */}
                  <View style={{ flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: theme.colors.black }}>
                      {item.totalAmount || "Unknown"} {item.unitType || ""}
                    </Text>
                  </View>
                </View>
              }
              containerStyle={{
                backgroundColor: theme.colors.white,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.greyOutline,
              }}
              isExpanded={expandedRows[item.id]}
              onPress={() => toggleRowExpansion(item.id)}
            >
              {/* 🔹 Expanded Row Content */}
              <View style={{ padding: 10, backgroundColor: theme.colors.grey5, borderRadius: 5 }}>
                <Text style={{ color: theme.colors.black, fontSize: 14, textAlign: "center" }}>
                  Expiry Date: {item.expiryDate || "N/A"}
                </Text>

                {/* 🔹 Buttons */}
                <Button
                  title="Edit for Later"
                  buttonStyle={{
                    backgroundColor: theme.colors.secondary,
                    paddingVertical: 8,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  titleStyle={{ color: theme.colors.black, fontWeight: "bold" }}
                  onPress={() => console.log("Edit Later")}
                />
                <Button
                  title="Remove"
                  buttonStyle={{
                    backgroundColor: theme.colors.error,
                    paddingVertical: 8,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
                  onPress={() => handleDeletePress(item.id)}
                />
              </View>
            </ListItem.Accordion>
          ))}
        </ScrollView>
      )}

      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to remove this ingredient?"
      />
    </View>
  );
};

export default Pantry;
