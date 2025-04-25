import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
import { useTheme } from "@rneui/themed";
import { useGetUserIngredients } from "@/hooks/useGetUserIngredients";
import { useAuth } from "@/providers/AuthProvider";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useDeleteUserIngredient } from "@/hooks/useDeleteUserIngredient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import BarcodeScan from "@/components/scan/BarcodeScan";
import IngredientModal from "@/components/modals/IngredientModal";
import UserIngredientModal from "@/components/modals/UserIngredientModal";
import { useScannerState } from "@/hooks/useScannerState";
import { useScannerLogic } from "@/hooks/useScannerLogic";
import { UserIngredientInput, UserIngredientUpdate } from "@/Interfaces/user-ingredient";
import { updateUserIngredient } from "@/services/user-ingredientService";
import UpdateUserIngredientModal from "../modals/UpdateUserIngredientModal";
import { UserIngredient } from "@/Interfaces/ingredient";
import ShomiFAB from "../common/ShomiFAB";
import { useToast } from "@/utils/toast";
import PantryHeader from "./PantryHeader";
import PantryList from "./PantryList";
import ChooseBatchModal from "../modals/ChooseBatchModal";
import { addShoppingListItem, getShoppingList } from "@/services/shoppingListService";
import { ShoppingItem } from "@/Interfaces/shopping-list";
import { getIngredientById } from "@/services/ingredientsService";
import { deleteShoppingListItem } from "@/services/shoppingListService";
import { usePaginatedUserIngredients } from "@/hooks/useGetPaginatedUserIngredients";
import { isExpired, isExpiringSoon } from "@/utils/dateHelpers";
import ShomiButton from "../common/ShomiButton";


// This is the main component for the Pantry screen is has been decoupled into smaller components for better readability and maintainability.
const Pantry: React.FC = () => {
  //#region hooks and states

  const { theme } = useTheme();
  const { userId } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const { action, ingredientId, quantity, ingredientName, shopId } = useLocalSearchParams();

  const { data: userIngredients, page, totalPages, loading, setPage, refetch } = usePaginatedUserIngredients(1, 10);
  const { userIngredients: allUserIngredients } = useGetUserIngredients(userId!);
  const { handleDeleteUserIngredient } = useDeleteUserIngredient();
  //#endregion

  //#region modal states

  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateUserIngredientModalVisible, setIsUpdateUserIngredientModalVisible] = useState(false);
  const [isChooseBatchModalVisible, setIsChooseBatchModalVisible] = useState(false);

  //#endregion

  //#region ingredient states

  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedUserIngredient, setSelectedUserIngredient] = useState<UserIngredient | null>(null);
  const [selectedUserIngredientId, setSelectedUserIngredientId] = useState<string | null>(null);
  const [matchingIngredientVariants, setMatchingIngredientVariants] = useState<UserIngredient[]>([]);
  const [selectedShoppingItem, setSelectedShoppingItem] = useState<ShoppingItem | null>(null);

  //#endregion

  //#region filter states

  const [search, setSearch] = useState("");
  const [expiryFilter, setExpiryFilter] = useState<"Soon" | "Expired" | null>(null);
  const [stockFilter, setStockFilter] = useState<"Low" | "OutOfStock" | null>(null);

  //#endregion

  //#region other states

  const [fabOpen, setFabOpen] = useState(false);
  const [scanning, setScanning] = useState(false);

  //#endregion

  //#region scanner states

  const {
    isAddIngredientModalVisible,
    isAddUserIngredientModalVisible,
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
    refetch,
    setMatchingIngredientVariants,
    setIsChooseBatchModalVisible
  );

  //#endregion

  //#region filter logic

  const isFiltering = !!search || expiryFilter !== null || stockFilter !== null;

  const baseIngredients = isFiltering ? allUserIngredients : userIngredients;

  const filteredUserIngredients = baseIngredients.filter((item) => {
    const nameMatch = item.ingredient.Ing_name.toLowerCase().includes(search.toLowerCase());

    const expiryMatch =
      expiryFilter === null ||
      (expiryFilter === "Soon" && isExpiringSoon(item.expiry_date)) ||
      (expiryFilter === "Expired" && isExpired(item.expiry_date));

    const totalAmount = parseFloat(item.totalAmount);

    const stockMatch =
      stockFilter === null ||
      (stockFilter === "Low" &&
        totalAmount > 0 &&
        item.ingredient.Ing_quantity &&
        totalAmount <= item.ingredient.Ing_quantity * 0.25) ||
      (stockFilter === "OutOfStock" && totalAmount === 0);

    return nameMatch && expiryMatch && stockMatch;
  });

  //#endregion

  //#region functions

  const handleDeletePress = (id: string) => {
    setSelectedIngredientId(id);
    setModalVisible(true);
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

  const handleUpdateIngredient = async (userIngredientId: string, userIngredient: UserIngredientUpdate) => {
    try {
      await updateUserIngredient(userIngredientId, userIngredient);
      refetch();
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
      const existingItems = await getShoppingList();

      const alreadyExists = existingItems.some((entry) => entry.ingredient.Ing_id === item.ingredient.Ing_id);
      if (alreadyExists) {
        showToast("error", "Duplicate", "Item is already in your shopping list.");
        return;
      }

      await addShoppingListItem({
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

  const handleAddNewVariant = () => {
    const source = scannedData ?? selectedShoppingItem?.ingredient;
    if (!source || !userId) return;
    const newIngredient: UserIngredientInput = {
      userId,
      ingredientId: source.Ing_id!,
      unitQuantity: selectedShoppingItem?.Shop_quantity || 0,
      totalAmount: (selectedShoppingItem?.Shop_quantity || 0) * (source.Ing_quantity || 1),
      unitType: source.Ing_quantity_units || "",
      expiry_date: "",
    };

    setUserIngredient(newIngredient);
    setIsChooseBatchModalVisible(false);
    setIsAddUserIngredientModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const idsToDelete =
        selectedIngredients.length > 0 ? selectedIngredients : selectedIngredientId ? [selectedIngredientId] : [];

      if (idsToDelete.length === 0) return;

      await handleDeleteUserIngredient(idsToDelete);
      refetch();
      showToast("success", "Ingredient Removed", "Ingredient removed successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setModalVisible(false);
      setSelectedIngredients([]);
      setSelectedIngredientId(null);
      setFabOpen(false);
    }
  };

  //#endregion

  //#region effects

  useEffect(() => {
    const handleRestock = async () => {
      const id = Array.isArray(ingredientId) ? ingredientId[0] : ingredientId;
      const qty = Array.isArray(quantity) ? quantity[0] : quantity;
      const parsedId = Number(id);
      const parsedQty = Number(qty);

      if (action !== "restock" || isNaN(parsedId) || isNaN(parsedQty)) return;

      const ingredient = await getIngredientById(parsedId);

      if (!ingredient) return;

      const matching = userIngredients.filter((ui) => ui.ingredient.Ing_id === parsedId);

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

  useFocusEffect(
    useCallback(() => {
      refetch();
      setSelectedIngredients([]);
    }, [refetch])
  );

  //#endregion

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
          <BarcodeScan onStopScanning={() => setScanning(false)} onBarcodeScanned={handleBarcodeScanned} />
        </View>
      ) : (
        <>
          <PantryHeader
            onFiltersChange={(filters) => {
              setSearch(filters.search);
              setExpiryFilter(filters.expiryFilter);
              setStockFilter(filters.stockFilter);
            }}
          />
          <PantryList
            userIngredients={filteredUserIngredients}
            selectedIngredients={selectedIngredients}
            onSelectIngredient={(id, isSelected) => {
              if (isSelected) {
                setSelectedIngredients((prev) => [...prev, id]);
              } else {
                setSelectedIngredients((prev) => prev.filter((itemId) => itemId !== id));
              }
            }}
            onAddToShoppingList={handleAddToShoppingList}
            onEditIngredient={(item) => {
              setSelectedUserIngredient(item);
              setSelectedUserIngredientId(item.id);
              setIsUpdateUserIngredientModalVisible(true);
            }}
            onDeleteIngredient={handleDeletePress}
            page={page}
            totalPages={totalPages}
            isFiltering={isFiltering}
            setPage={setPage}
          />

          {selectedIngredients.length > 0 && (
            <Animated.View
              style={{
                position: "absolute",
                left: 15,
                bottom: 20,
                width: "75%",
                opacity: selectedIngredients.length > 0 ? 1 : 0,
              }}
            >
              <ShomiButton title="Find Recipes" onPress={handleFindRecipes} />
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
            onClose={() => {
              setIsChooseBatchModalVisible(false);
              router.replace("/(tabs)");
            }}
            ingredientName={scannedData?.Ing_name || selectedShoppingItem?.ingredient.Ing_name || ""}
            variants={matchingIngredientVariants}
            onSelectVariant={(variant: UserIngredient) => {
              setSelectedUserIngredient(variant);
              setSelectedUserIngredientId(variant.id);
              setIsChooseBatchModalVisible(false);
              setIsUpdateUserIngredientModalVisible(true);
            }}
            onAddNewVariant={() => handleAddNewVariant()}
          />
        </>
      )}
    </View>
  );
};

export default Pantry;
