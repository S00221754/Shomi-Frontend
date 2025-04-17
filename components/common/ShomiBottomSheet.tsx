import React, { useState, useMemo } from "react";
import { View } from "react-native";
import {
  BottomSheet,
  SearchBar,
  Icon,
  ListItem,
  useTheme,
} from "@rneui/themed";

//could not find a react native searchable dropdown that is not deprecated or has issues with expo so used bottomsheet from react native elements to create my own searchable dropdown.
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

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setSearchTerm("");
    onClose();
  };

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        labelExtractor(item).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, data, labelExtractor]
  );

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={handleClose}>
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
          onPress={handleClose}
        />
      </View>

      {filteredData.map((item) => (
        <ListItem
          key={keyExtractor(item)}
          bottomDivider
          onPress={() => handleSelect(item)}
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
