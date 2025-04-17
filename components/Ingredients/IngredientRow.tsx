import React from "react";
import { View } from "react-native";
import { Card, Text, Button, Icon, useTheme } from "@rneui/themed";
import { SelectedIngredient } from "@/Interfaces/ingredient";

interface IngredientRowProps {
  ingredient: SelectedIngredient;
  onPress: () => void;
  onRemove: () => void;
}

const IngredientRow: React.FC<IngredientRowProps> = ({
  ingredient,
  onPress,
  onRemove,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  return (
    <Card
      containerStyle={{
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: theme.colors.greyOutline,
        backgroundColor: isDark ? theme.colors.grey0 : theme.colors.white,
      }}
      wrapperStyle={{ flexDirection: "row", alignItems: "center" }}
    >
      <View style={{ flex: 1 }} onTouchEnd={onPress}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 4,
            color: isDark ? theme.colors.white : theme.colors.black,
          }}
        >
          {ingredient.ingredient_name}
        </Text>
        <Text
          style={{
            color: isDark ? theme.colors.grey4 : theme.colors.grey3,
            fontSize: 14,
          }}
        >
          {ingredient.quantity} {ingredient.unit}
        </Text>
      </View>
      <Button
        type="clear"
        icon={<Icon name="close" color={theme.colors.error} />}
        onPress={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </Card>
  );
};

export default IngredientRow;
