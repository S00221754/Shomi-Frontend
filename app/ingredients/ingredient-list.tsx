import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, ListItem } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { getIngredients } from "@/services/ingredientsService";
import { ProductInfo } from "@/types/ingredient";

const IngredientList = () => {
  const { theme } = useTheme();
  const [ingredients, setIngredients] = useState<ProductInfo[]>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 10 }}>
      <Text h4 style={{ color: theme.colors.primary, marginBottom: 10 }}>Ingredient List</Text>

      <ScrollView>
        {ingredients.map((item, index) => (
          <ListItem
            key={index}
            bottomDivider
            containerStyle={{ backgroundColor: theme.colors.white }}
          >
            <ListItem.Content>
              <ListItem.Title style={{ color: theme.colors.black }}>{item.Ing_name}</ListItem.Title>
              <ListItem.Subtitle style={{ color: theme.colors.grey2 }}>{item.Ing_brand}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
};

export default IngredientList;
