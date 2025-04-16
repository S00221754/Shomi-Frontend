import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Animated,
} from "react-native";
import {
  Text,
  Button,
  Card,
  ListItem,
  Icon,
  CheckBox,
  Badge,
} from "@rneui/themed";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/providers/AuthProvider";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@rneui/themed";
import BarcodeScan from "@/components/scan/BarcodeScan";
import IngredientModal from "@/components/modals/IngredientModal";
import UserIngredientModal from "@/components/modals/UserIngredientModal";
import { useScannerState } from "@/hooks/useScannerState";
import { useScannerLogic } from "@/hooks/useScannerLogic";
import {
  UserIngredientInput,
  UserIngredientUpdate,
} from "@/Interfaces/user-ingredient";
import {
  quickRestockUserIngredient,
  updateUserIngredient,
} from "@/services/user-ingredientService";
import UpdateUserIngredientModal from "../modals/UpdateUserIngredientModal";
import {
  ExpiryStatus,
  QuantityStatus,
  UserIngredient,
} from "@/Interfaces/ingredient";
import ShomiFAB from "../common/ShomiFAB";
import { showToast } from "@/utils/toast";
import ShomiButton from "../common/ShomiButton";
import ChooseBatchModal from "../modals/ChooseBatchModal";
import { addShoppingListItem } from "@/services/shoppingListService";
import dayjs from "dayjs";
import { ShoppingItem } from "@/Interfaces/shopping-list";
import { getIngredientById } from "@/services/ingredientsService";
import { deleteShoppingListItem } from "@/services/shoppingListService";

//TODO: decouple and try and lessen the amount of code on this and use more components as it is getting too complicated.
const Pantry: React.FC = () => {
  const { theme } = useTheme();
  const { userId } = useAuth();
  const router = useRouter();
  const { action, ingredientId, quantity, ingredientName, shopId } =
    useLocalSearchParams();

  const { userIngredients, loading, fetchUserIngredients } =
    useGetUserIngredients(userId ?? "");
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [fabOpen, setFabOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [
    isUpdateUserIngredientModalVisible,
    setIsUpdateUserIngredientModalVisible,
  ] = useState(false);
  const [selectedUserIngredient, setSelectedUserIngredient] =
    useState<UserIngredient | null>(null);
  const [selectedUserIngredientId, setSelectedUserIngredientId] = useState<
    string | null
  >(null);
  const [matchingIngredientVariants, setMatchingIngredientVariants] = useState<
    UserIngredient[]
  >([]);
  const [isChooseBatchModalVisible, setIsChooseBatchModalVisible] =
    useState(false);

  const [selectedShoppingItem, setSelectedShoppingItem] =
    useState<ShoppingItem | null>(null);

  useEffect(() => {
    //TODO: either find a better solution or put this somewhere to be reusable
    const handleRestock = async () => {
      const id = Array.isArray(ingredientId) ? ingredientId[0] : ingredientId;
      const qty = Array.isArray(quantity) ? quantity[0] : quantity;
      const parsedId = Number(id);
      const parsedQty = Number(qty);

      if (action !== "restock" || isNaN(parsedId) || isNaN(parsedQty)) return;

      const ingredient = await getIngredientById(parsedId);
      if (!ingredient) return;

      const matching = userIngredients.filter(
        (ui) => ui.ingredient.Ing_id === parsedId
      );

      if (matching.length > 1) {
        setMatchingIngredientVariants(matching);

        setSelectedShoppingItem({
          Shop_id: typeof shopId === "string" ? shopId : "from-shopping",
          user_id: userId!,
          ingredient_id: parsedId,
          Shop_quantity: parsedQty,
          Shop_added_automatically: false,
          Shop_reason: "",
          Shop_created_at: new Date().toISOString(),
          ingredient,
        });

        setIsChooseBatchModalVisible(true);
      } else {
        setUserIngredient({
          userId: userId!,
          ingredientId: parsedId,
          unitQuantity: parsedQty,
          totalAmount: parsedQty * (ingredient.Ing_quantity || 1),
          unitType: ingredient.Ing_quantity_units || "",
          expiry_date: "",
        });

        setIsAddUserIngredientModalVisible(true);
      }
    };

    handleRestock();
  }, [action, ingredientId, quantity, shopId, userIngredients]);

  const handleDeletePress = (id: string) => {
    setSelectedIngredientId(id);
    setModalVisible(true);
  };

  const toggleIngredientSelection = (
    ingredientId: string,
    isChecked: boolean
  ) => {
    setSelectedIngredients((prev) =>
      isChecked
        ? [...prev, ingredientId]
        : prev.filter((id) => id !== ingredientId)
    );
  };

  const toggleRowExpansion = (ingredientId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const handleConfirmDelete = async () => {
    try {
      const idsToDelete =
        selectedIngredients.length > 0
          ? selectedIngredients
          : selectedIngredientId
          ? [selectedIngredientId]
          : [];

      if (idsToDelete.length === 0) return;

      await handleDeleteUserIngredient(idsToDelete);
      fetchUserIngredients();
      showToast(
        "success",
        "Ingredient Removed",
        "Ingredient removed successfully."
      );
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setModalVisible(false);
      setSelectedIngredients([]);
      setSelectedIngredientId(null);
      setFabOpen(false);
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

  const handleUpdateIngredient = async (
    userIngredientId: string,
    userIngredient: UserIngredientUpdate
  ) => {
    try {
      await updateUserIngredient(userIngredientId, userIngredient);
      fetchUserIngredients();
      setIsUpdateUserIngredientModalVisible(false);

      if (action === "restock" && typeof shopId === "string") {
        await deleteShoppingListItem(shopId);
      }

      router.replace("/(tabs)");
      showToast("success", "Ingredient Updated");
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  const handleAddToShoppingList = async (item: UserIngredient) => {
    try {
      if (!userId) return;

      await addShoppingListItem({
        user_id: userId,
        ingredient_id: item.ingredient.Ing_id,
        Shop_quantity: 1,
        Shop_added_automatically: false,
        Shop_reason: "",
      });

      showToast("success", "Added", "Item added to your shopping list.");
    } catch (error) {
      console.error("Error adding to shopping list:", error);
      showToast("error", "Error", "Could not add to shopping list.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserIngredients();
    }, [fetchUserIngredients])
  );

  const {
    isAddIngredientModalVisible,
    isAddUserIngredientModalVisible,
    handleScanProduct,
    handleStopScanning,
    closeIngredientModal,
    closeUserIngredientModal,
    setIsAddIngredientModalVisible,
    setIsAddUserIngredientModalVisible,
  } = useScannerState();

  const {
    scannedData,
    userIngredient,
    setUserIngredient,
    handleBarcodeScanned,
    handleAddIngredient,
    handleAddUserIngredient,
  } = useScannerLogic(
    userIngredients,
    setIsAddIngredientModalVisible,
    setIsAddUserIngredientModalVisible,
    setSelectedUserIngredient,
    setSelectedUserIngredientId,
    setIsUpdateUserIngredientModalVisible,
    fetchUserIngredients,
    setMatchingIngredientVariants,
    setIsChooseBatchModalVisible
  );

  const handleAddNewVariant = () => {
    const source = scannedData ?? selectedShoppingItem?.ingredient;
    if (!source || !userId) return;

    const newIngredient: UserIngredientInput = {
      userId,
      ingredientId: source.Ing_id!,
      unitQuantity: selectedShoppingItem?.Shop_quantity || 0,
      totalAmount:
        (selectedShoppingItem?.Shop_quantity || 0) * (source.Ing_quantity || 1),
      unitType: source.Ing_quantity_units || "",
      expiry_date: "",
    };

    setUserIngredient(newIngredient);
    setIsChooseBatchModalVisible(false);
    setIsAddUserIngredientModalVisible(true);
  };

  const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);

    if (expiry.isBefore(today, "day")) return ExpiryStatus.Expired;
    if (expiry.diff(today, "day") <= 3) return ExpiryStatus.Soon;
    return ExpiryStatus.Fresh;
  };

  const renderExpiryBadge = (expiryDate: string) => {
    const status = getExpiryStatus(expiryDate);

    const ingredientStatus = {
      [ExpiryStatus.Expired]: "error",
      [ExpiryStatus.Soon]: "warning",
      [ExpiryStatus.Fresh]: "success",
    } as const;
    return (
      <Badge
        value={status}
        status={ingredientStatus[status]}
        containerStyle={{ marginLeft: 6 }}
      />
    );
  };

  const getQuantityStatus = (
    totalAmountStr: string,
    baseAmount: number
  ): QuantityStatus => {
    const totalAmount = parseFloat(totalAmountStr);

    if (isNaN(totalAmount)) return QuantityStatus.OutOfStock;

    if (totalAmount <= 0) return QuantityStatus.OutOfStock;
    if (totalAmount < baseAmount * 0.25) return QuantityStatus.Low;
    return QuantityStatus.InStock;
  };

  const renderQuantityBadge = (totalAmount: string, baseAmount: number) => {
    const status = getQuantityStatus(totalAmount, baseAmount);

    const quantityColor = {
      [QuantityStatus.OutOfStock]: "error",
      [QuantityStatus.Low]: "warning",
      [QuantityStatus.InStock]: "success",
    } as const;

    return (
      <Badge
        value={status}
        status={quantityColor[status]}
        containerStyle={{ marginLeft: 6 }}
      />
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: 0,
      }}
    >
      {scanning ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <BarcodeScan
            onStopScanning={() => setScanning(false)}
            onBarcodeScanned={handleBarcodeScanned}
          />
        </View>
      ) : (
        <ScrollView
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            paddingBottom: selectedIngredients.length > 0 ? 100 : 75,
          }}
        >
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
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>
                  Select
                </Text>
              </View>

              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 15, //keep name aligned with its content
                }}
              >
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>
                  Name
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", color: theme.colors.black }}>
                  Status
                </Text>
              </View>
            </View>
          </View>

          {userIngredients.map((item) => (
            <View
              key={item.id}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.greyOutline,
                backgroundColor: theme.colors.white,
              }}
            >
              <ListItem.Accordion
                content={
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center", // ensures vertical centering
                      flex: 1,
                      paddingVertical: 10, // optional, improves spacing
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        toggleIngredientSelection(
                          item.id,
                          !selectedIngredients.includes(item.id)
                        )
                      }
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
                          checked={selectedIngredients.includes(item.id)}
                          onPress={() =>
                            toggleIngredientSelection(
                              item.id,
                              !selectedIngredients.includes(item.id)
                            )
                          }
                          checkedColor={theme.colors.primary}
                          uncheckedColor={theme.colors.greyOutline}
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
                          <Text style={{ color: theme.colors.black }}>
                            {item.ingredient.Ing_name}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center", // ✅ centers both vertically & horizontally
                        flexDirection: "column", // ✅ badges stack if needed
                        gap: 4, // better spacing between badges
                      }}
                    >
                      {item.expiry_date && renderExpiryBadge(item.expiry_date)}
                      {item.ingredient?.Ing_quantity != null &&
                        renderQuantityBadge(
                          item.totalAmount,
                          item.ingredient.Ing_quantity
                        )}
                    </View>
                  </View>
                }
                containerStyle={{
                  backgroundColor: theme.colors.white,
                }}
                isExpanded={expandedRows[item.id]}
                onPress={() => toggleRowExpansion(item.id)}
              >
                <View
                  style={{
                    padding: 10,
                    backgroundColor: theme.colors.white,
                    borderRadius: 5,
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: item.expiry_date
                        ? "space-between"
                        : "flex-start",
                      alignItems: "center",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 4,
                      marginBottom: 8,
                      gap: 12,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="scale-balance"
                        type="material-community"
                        size={18}
                        color={theme.colors.grey1}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={{ color: theme.colors.black, fontSize: 14 }}>
                        Quantity:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {item.unitQuantity || "N/A"}
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <Icon
                        name="package-variant"
                        type="material-community"
                        size={18}
                        color={theme.colors.grey1}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={{ color: theme.colors.black, fontSize: 14 }}>
                        Amount:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {item.totalAmount || "Unknown"} {item.unitType || ""}
                        </Text>
                      </Text>
                    </View>

                    {item.expiry_date && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Icon
                          name="calendar-clock"
                          type="material-community"
                          size={18}
                          color={theme.colors.grey1}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={{ color: theme.colors.black, fontSize: 14 }}
                        >
                          Expiry:{" "}
                          <Text style={{ fontWeight: "bold" }}>
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
                        onPress: () => {
                          setSelectedUserIngredient(item);
                          setSelectedUserIngredientId(item.id);
                          setIsUpdateUserIngredientModalVisible(true);
                        },
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

      <ShomiFAB
        selectedItems={selectedIngredients}
        onDelete={() => setModalVisible(true)}
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        allowDelete={true}
        actions={[
          {
            icon: "plus",
            label: "Add Ingredient Manually",
            onPress: () => router.push("/ingredients/ingredient-list"),
          },
          {
            icon: "barcode-scan",
            label: "Scan Barcode",
            onPress: () => setScanning(true),
          },
          {
            icon: "magnify",
            label: "Search Recipes with Pantry",
            onPress: () => router.push("/recipes/recommendedRecipesScreen"),
          },
        ]}
      />

      {/* Modals */}
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false), setFabOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        message={
          selectedIngredients.length > 0
            ? "Are you sure you want to remove these ingredients?"
            : "Are you sure you want to remove this ingredient?"
        }
      />

      <UserIngredientModal
        visible={isAddUserIngredientModalVisible}
        onClose={closeUserIngredientModal}
        userIngredient={userIngredient}
        onAddUserIngredient={handleAddUserIngredient}
        ingredient={(scannedData || selectedShoppingItem?.ingredient) ?? null}
      />
      <IngredientModal
        visible={isAddIngredientModalVisible}
        onClose={closeIngredientModal}
        ingredient={scannedData}
        onAddIngredient={async (ingredient) => {
          await handleAddIngredient(ingredient);
          closeIngredientModal();
          setIsAddUserIngredientModalVisible(true);
        }}
      />
      <UpdateUserIngredientModal
        visible={isUpdateUserIngredientModalVisible}
        onClose={() => setIsUpdateUserIngredientModalVisible(false)}
        userIngredient={selectedUserIngredient}
        userIngredientId={selectedUserIngredientId}
        onUpdateUserIngredient={handleUpdateIngredient}
      />

      <ChooseBatchModal
        visible={isChooseBatchModalVisible}
        onClose={() => setIsChooseBatchModalVisible(false)}
        ingredientName={
          scannedData?.Ing_name ||
          selectedShoppingItem?.ingredient.Ing_name ||
          ""
        }
        variants={matchingIngredientVariants}
        onSelectVariant={(variant: UserIngredient) => {
          setSelectedUserIngredient(variant);
          setSelectedUserIngredientId(variant.id);
          setIsChooseBatchModalVisible(false);
          setIsUpdateUserIngredientModalVisible(true);
        }}
        onAddNewVariant={() => handleAddNewVariant()}
      />
    </View>
  );
};

export default Pantry;
