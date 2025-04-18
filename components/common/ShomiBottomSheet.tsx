import React, { useState, useMemo } from "react";
import { View, ScrollView, Text } from "react-native";
import {
  BottomSheet,
  SearchBar,
  Icon,
  ListItem,
  useTheme,
} from "@rneui/themed";

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
          maxHeight: 750,
          minHeight: 250,
          backgroundColor: theme.colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 10,
            backgroundColor: theme.colors.background,
            borderBottomWidth: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder={placeholder}
              onChangeText={setSearchTerm}
              value={searchTerm}
              round
              inputStyle={{
                color:
                  theme.mode === "dark"
                    ? theme.colors.white
                    : theme.colors.black,
              }}
              containerStyle={{
                backgroundColor: theme.colors.background,
                borderTopColor: "transparent",
                borderBottomWidth: 0,
              }}
              inputContainerStyle={{
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
              marginLeft: 5,
            }}
            onPress={handleClose}
          />
        </View>

        <ScrollView
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
        >
          {filteredData.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                color:
                  theme.mode === "dark"
                    ? theme.colors.grey3
                    : theme.colors.grey1,
                padding: 20,
              }}
            >
              No results found
            </Text>
          ) : (
            filteredData.map((item) => (
              <ListItem
                key={keyExtractor(item)}
                bottomDivider
                onPress={() => handleSelect(item)}
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
                    {labelExtractor(item)}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

export default BottomSheetSelect;
