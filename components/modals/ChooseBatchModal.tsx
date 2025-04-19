import React from "react";
import { View, FlatList, Pressable } from "react-native";
import { Overlay, Text, useTheme } from "@rneui/themed";
import { UserIngredient } from "@/Interfaces/ingredient";
import ShomiButton from "@/components/common/ShomiButton";
import { Icon } from "@rneui/themed";

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
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;

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
      <Text
        h4
        style={{
          textAlign: "center",
          marginBottom: 10,
          color: theme.colors.primary,
        }}
      >
        Choose a Batch for {ingredientName}
      </Text>

      <FlatList
        data={variants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelectVariant(item)}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: theme.colors.greyOutline,
            }}
          >
            <Text style={{ color: textColor, fontWeight: "600" }}>
              Quantity: {item.unitQuantity} | Total: {item.totalAmount} {item.unitType || ""}
            </Text>
            <Text style={{ color: theme.colors.grey3 }}>Expiry: {item.expiry_date || "None"}</Text>
          </Pressable>
        )}
        ListFooterComponent={() => (
          <View style={{ marginTop: 16, gap: 10 }}>
            <ShomiButton
              title="Add New Variant"
              icon="plus"
              onPress={onAddNewVariant}
              color={theme.colors.primary}
              buttonStyle={{
                borderRadius: 10,
                paddingVertical: 10,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: theme.colors.white,
              }}
            />

            <ShomiButton
              title="Cancel"
              icon="close"
              onPress={onClose}
              color={theme.colors.error}
              buttonStyle={{
                borderRadius: 10,
                paddingVertical: 10,
              }}
              titleStyle={{
                fontWeight: "bold",
                color: theme.colors.white,
              }}
            />
          </View>
        )}
      />
    </Overlay>
  );
};

export default ChooseBatchModal;
