import React from "react";
import { View } from "react-native";
import { Card, Text, Button, Icon, useTheme } from "@rneui/themed";
import { SelectedIngredient } from "@/Interfaces/ingredient";

// This component represents a single row in the ingredient list of a recipe.
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

  return (
    <Card
      containerStyle={{
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: theme.colors.greyOutline,
        backgroundColor: theme.colors.white,
      }}
      wrapperStyle={{ flexDirection: "row", alignItems: "center" }}
    >
      <View style={{ flex: 1 }} onTouchEnd={onPress}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
          {ingredient.ingredient_name}
        </Text>
        <Text style={{ color: theme.colors.grey2, fontSize: 14 }}>
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
