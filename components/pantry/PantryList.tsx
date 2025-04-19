import React from "react";
import { View, ScrollView, Text } from "react-native";
import { Card, useTheme } from "@rneui/themed";
import PantryItem from "./PantryItem";
import ShomiButton from "../common/ShomiButton";
import { UserIngredient } from "@/Interfaces/ingredient";

interface PantryListProps {
  userIngredients: UserIngredient[];
  selectedIngredients: string[];
  toggleIngredientSelection: (ingredientId: string, isChecked: boolean) => void;
  expandedRows: { [key: string]: boolean };
  toggleRowExpansion: (ingredientId: string) => void;
  handleAddToShoppingList: (item: UserIngredient) => Promise<void>;
  handleDeletePress: (id: string) => void;
  handleEditPress: (item: UserIngredient) => void;
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PantryList: React.FC<PantryListProps> = ({
  userIngredients,
  selectedIngredients,
  toggleIngredientSelection,
  expandedRows,
  toggleRowExpansion,
  handleAddToShoppingList,
  handleDeletePress,
  handleEditPress,
  page,
  totalPages,
  setPage,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentContainerStyle={{
        paddingBottom: selectedIngredients.length > 0 ? 125 : 100,
      }}
    >
      <View
        style={{
          backgroundColor:
            theme.mode === "dark" ? theme.colors.grey5 : theme.colors.grey4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 12,
            paddingRight: 60, //this is to keep the headers aligned with the content
            backgroundColor: theme.colors.primary,
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
            <Text
              style={{
                fontWeight: "bold",
                color: theme.colors.white,
              }}
            >
              Select
            </Text>
          </View>

          <View
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              paddingRight: 15,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: theme.colors.white,
              }}
            >
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
            <Text
              style={{
                fontWeight: "bold",
                color: theme.colors.white,
              }}
            >
              Status
            </Text>
          </View>
        </View>
      </View>
      {userIngredients.length === 0 && (
        <Card
          containerStyle={{
            backgroundColor:
              theme.mode === "dark" ? theme.colors.black : theme.colors.white,
            borderRadius: 10,
            margin: 16,
          }}
        >
          <Text
            style={{
              color:
                theme.mode === "dark" ? theme.colors.white : theme.colors.black,
              textAlign: "center",
            }}
          >
            No ingredients found.
          </Text>
        </Card>
      )}
      {userIngredients.map((item) => (
        <PantryItem
          key={item.id}
          item={item}
          isSelected={selectedIngredients.includes(item.id)}
          toggleIngredientSelection={toggleIngredientSelection}
          isExpanded={expandedRows[item.id]}
          toggleRowExpansion={toggleRowExpansion}
          handleAddToShoppingList={handleAddToShoppingList}
          handleDeletePress={handleDeletePress}
          handleEditPress={handleEditPress}
        />
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
  );
};

export default PantryList;
