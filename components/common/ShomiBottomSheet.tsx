import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { BottomSheet, SearchBar, Icon, ListItem, useTheme } from "@rneui/themed";

interface BottomSheetSelectProps<T> {
  isVisible: boolean;
  onClose: () => void;
  data: T[];
  onSelect: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  labelExtractor: (item: T) => string;
  placeholder?: string;
}

function BottomSheetSelect<T>({
  isVisible,
  onClose,
  data,
  onSelect,
  keyExtractor,
  labelExtractor,
  placeholder = "Search...",
}: BottomSheetSelectProps<T>) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        labelExtractor(item).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, data, labelExtractor]
  );

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.grey3,
        }}
      >
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder={placeholder}
            onChangeText={setSearchTerm}
            value={searchTerm}
            lightTheme
            round
            inputStyle={{ color: theme.colors.black }}
            containerStyle={{
              backgroundColor: theme.colors.background,
              borderTopColor: "transparent",
            }}
            inputContainerStyle={{
              backgroundColor: "#eee",
              borderRadius: 20,
            }}
          />
        </View>

        <Icon
          name="close"
          type="material"
          size={26}
          color={theme.colors.white}
          containerStyle={{
            backgroundColor: theme.colors.error,
            borderRadius: 20,
            padding: 6,
            marginRight: 5,
          }}
          onPress={onClose}
        />
      </View>

      {filteredData.map((item) => (
        <ListItem
          key={keyExtractor(item)}
          bottomDivider
          onPress={() => {
            onSelect(item);
            onClose();
          }}
        >
          <ListItem.Content>
            <ListItem.Title style={{ color: theme.colors.black }}>
              {labelExtractor(item)}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

export default BottomSheetSelect;
