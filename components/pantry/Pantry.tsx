import React, { useCallback, useState } from "react";
import { View, ScrollView, ActivityIndicator, Pressable, Animated, Dimensions } from "react-native";
import { Text, Button, Card, ListItem, Icon, CheckBox } from "@rneui/themed";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";
import { FAB } from "react-native-paper";

const Pantry: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { userIngredients, loading, fetchUserIngredients } = useGetUserIngredients(user?.uid || "");
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();
  const screenWidth = Dimensions.get("window").width;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [fabOpen, setFabOpen] = useState(false);

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

  const handleFindRecipes = () => {
    const selectedIngIds = userIngredients
      .filter((item) => selectedIngredients.includes(item.id))
      .map((item) => item.ingredient.Ing_id.toString());

    router.push({
      pathname: "/recipes/recommendedRecipesScreen",
      params: { selectedIngredients: JSON.stringify(selectedIngIds) },
    });
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
                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0 }}
                        size={32}
                        iconType="material-community"
                        checkedIcon="checkbox-marked"
                        uncheckedIcon="checkbox-blank-outline"
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

      {selectedIngredients.length > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: "80%",
            opacity: selectedIngredients.length > 0 ? 1 : 0,
          }}
        >
          <Button
            title="Find Recipes"
            onPress={handleFindRecipes}
            buttonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
              paddingVertical: 12,
              paddingHorizontal: 20,
            }}
            titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
          />
        </Animated.View>
      )}

      <FAB.Group
        open={fabOpen}
        visible={true}
        icon={
          selectedIngredients.length > 0
            ? "delete"
            : fabOpen
              ? "close"
              : "plus"
        }
        color={theme.colors.white}
        fabStyle={{
          backgroundColor: selectedIngredients.length > 0 ? theme.colors.error : theme.colors.primary,
        }}
        backdropColor="rgba(0,0,0,0.5)"
        actions={
          selectedIngredients.length > 0
            ? []
            : [
              {
                icon: "plus",
                label: "Add Ingredient Manually",
                onPress: () => console.log("Navigate to Add Ingredient Screen"),
                labelStyle: {
                  backgroundColor: theme.colors.grey4,
                  color: theme.colors.black,
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                },
              },
              {
                icon: "barcode-scan",
                label: "Scan Barcode",
                onPress: () => console.log("Navigate to Barcode Scanner"),
                labelStyle: {
                  backgroundColor: theme.colors.grey4,
                  color: theme.colors.black,
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                },
              },
              {
                icon: "magnify",
                label: "Search Recipes with Pantry",
                onPress: () => {
                  router.push("/recipes/recommendedRecipesScreen");
                },
                labelStyle: {
                  backgroundColor: theme.colors.grey4,
                  color: theme.colors.black,
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                },
              },
            ]
        }
        onPress={() => {
          if (selectedIngredients.length > 0) {
            console.log("Selected Ingredients to Remove:", selectedIngredients);
            setModalVisible(true); // ✅ Show confirmation modal for deletion
          } else {
            setFabOpen(!fabOpen); // ✅ Toggle normal FAB
          }
        }}
        onStateChange={({ open }) => setFabOpen(open)}
      />
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => {setModalVisible(false), setFabOpen(false)}}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to remove this ingredient?"
      />
    </View>
  );
};

export default Pantry;
