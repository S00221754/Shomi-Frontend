import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { SearchBar, useTheme } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import ShomiButton from "../common/ShomiButton";

interface PantryHeaderProps {
  onFiltersChange: (filters: {
    search: string;
    expiryFilter: "Soon" | "Expired" | null;
    stockFilter: "Low" | "OutOfStock" | null;
  }) => void;
}

// component for the search and the filter options in the pantry screen
const PantryHeader: React.FC<PantryHeaderProps> = ({ onFiltersChange }) => {
  //#region states, hooks, variables and effects

  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [expiryFilter, setExpiryFilter] = useState<"Soon" | "Expired" | null>(null);
  const [stockFilter, setStockFilter] = useState<"Low" | "OutOfStock" | null>(null);

  const expiryOptions = [
    { label: "Select", value: null },
    { label: "Soon", value: "Soon" },
    { label: "Expired", value: "Expired" },
  ];

  const stockOptions = [
    { label: "Select", value: null },
    { label: "Low Supply", value: "Low" },
    { label: "Out of Stock", value: "OutOfStock" },
  ];

  useEffect(() => {
    onFiltersChange({
      search: search.trim(),
      expiryFilter,
      stockFilter,
    });
  }, [search, expiryFilter, stockFilter]);

  //#endregion

  return (
    <View style={{ marginBottom: 16, padding: 10 }}>
      <SearchBar
        placeholder="Search pantry..."
        onChangeText={(text) => {
          setSearch(text);
        }}
        value={search}
        round
        lightTheme={theme.mode === "light"}
        inputStyle={{
          color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
        }}
        inputContainerStyle={{
          backgroundColor: theme.colors.searchBg,
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "600",
              marginBottom: 4,
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
              textAlign: "center",
            }}
          >
            Expiry Filter
          </Text>
          <Dropdown
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 10,
              paddingHorizontal: 12,
              height: 40,
              borderColor: theme.colors.grey4,
              borderWidth: 1,
            }}
            placeholderStyle={{ color: theme.colors.grey3 }}
            selectedTextStyle={{
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
            }}
            containerStyle={{
              borderWidth: 1,
              borderColor: theme.colors.greyOutline,
              backgroundColor: theme.colors.background,
              borderRadius: 10,
            }}
            data={expiryOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={expiryFilter}
            onChange={(item) => {
              setExpiryFilter(item.value ?? null);
            }}
            itemTextStyle={{
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
            }}
            activeColor={theme.colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "600",
              marginBottom: 4,
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
              textAlign: "center",
            }}
          >
            Stock Filter
          </Text>
          <Dropdown
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: 10,
              paddingHorizontal: 12,
              height: 40,
              borderColor: theme.colors.grey4,
              borderWidth: 1,
            }}
            placeholderStyle={{ color: theme.colors.grey3 }}
            selectedTextStyle={{
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
            }}
            containerStyle={{
              borderWidth: 1,
              borderColor: theme.colors.greyOutline,
              backgroundColor: theme.colors.background,
              borderRadius: 10,
            }}
            data={stockOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={stockFilter}
            onChange={(item) => {
              setStockFilter(item.value ?? null);
            }}
            itemTextStyle={{
              color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
            }}
            activeColor={theme.colors.primary}
          />
        </View>
      </View>

      {(search || expiryFilter || stockFilter) && (
        <ShomiButton
          title="Clear Filters"
          icon="close-circle"
          color={theme.colors.error}
          onPress={() => {
            setSearch("");
            setExpiryFilter(null);
            setStockFilter(null);
          }}
        />
      )}
    </View>
  );
};

export default PantryHeader;
