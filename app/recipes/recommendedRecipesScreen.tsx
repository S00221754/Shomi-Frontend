import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getRecommendedRecipes } from "../../services/recipe.Service";
import { Recipe } from "../../types/recipe";
import { useAuth } from "@/context/AuthContext";
import { useTheme, Text, Card, Button } from "@rneui/themed";

export default function RecommendedRecipesScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();

    const selectedIngredients = params.selectedIngredients ? JSON.parse(params.selectedIngredients as string) : [];

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecommendedRecipes(user?.uid || "", selectedIngredients);
                setRecipes(data);
            } catch (error) {
                console.error("Error Fetching Recipes:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecipes();
    }, [user?.uid]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
            <Text h3 style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.primary, marginBottom: 15 }}>
                Recommended Recipes
            </Text>
            
            {recipes.map((recipe) => (
                <Card key={recipe.recipe_id} containerStyle={{ backgroundColor: theme.colors.white, borderRadius: 10, padding: 15 }}>
                    <Card.Title style={{ fontSize: 18, fontWeight: "bold", color: theme.colors.black }}>
                        {recipe.recipe_name}
                    </Card.Title>
                    <Card.Divider />
                    <Text style={{ fontSize: 14, color: theme.colors.grey3, marginBottom: 5 }}>
                        {recipe.recipe_description}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.colors.primary, marginBottom: 10 }}>
                        ⏱ {recipe.cooking_time} mins
                    </Text>
                    <Button
                        title="View Recipe"
                        buttonStyle={{ backgroundColor: theme.colors.primary, borderRadius: 8, paddingVertical: 10 }}
                        titleStyle={{ fontWeight: "bold", color: theme.colors.white }}
                        onPress={() => router.push({ pathname: `/recipes/[id]`, params: { id: recipe.recipe_id } })}
                    />
                </Card>
            ))}
        </ScrollView>
    );
}
