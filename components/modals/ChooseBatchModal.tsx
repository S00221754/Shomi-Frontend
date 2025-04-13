import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Overlay, Text, useTheme, Icon } from "@rneui/themed";
import { UserIngredient } from "@/Interfaces/ingredient";

// This component is a modal that allows the user to choose a batch of an ingredient from a list of variants. It displays the variants in a list and provides an option to add a new variant.
interface ChooseBatchModalProps {
  visible: boolean;
  onClose: () => void;
  variants: UserIngredient[];
  onSelectVariant: (variant: UserIngredient) => void;
  onAddNewVariant: () => void;
  ingredientName: string;
}

const ChooseBatchModal: React.FC<ChooseBatchModalProps> = ({
  visible,
  onClose,
  variants,
  onSelectVariant,
  onAddNewVariant,
  ingredientName,
}) => {
  const { theme } = useTheme();

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={{
        width: "90%",
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Text h4 style={{ textAlign: "center", marginBottom: 10 }}>
        Choose a Batch for {ingredientName}
      </Text>

      <FlatList
        data={variants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectVariant(item)}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: theme.colors.grey3,
            }}
          >
            <Text style={{ color: theme.colors.black, fontWeight: "600" }}>
              Quantity: {item.unitQuantity} | Total: {item.totalAmount}{" "}
              {item.unitType || ""}
            </Text>
            <Text style={{ color: theme.colors.grey2 }}>
              Expiry: {item.expiry_date || "None"}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            onPress={onAddNewVariant}
            style={{
              padding: 16,
              marginTop: 10,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.colors.white, fontWeight: "bold" }}>
              <Icon
                name="plus"
                type="material-community"
                color="white"
                size={16}
              />{" "}
              Add New Variant
            </Text>
          </TouchableOpacity>
        )}
      />
    </Overlay>
  );
};

export default ChooseBatchModal;
