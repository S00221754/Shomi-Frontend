import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Touchable, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getRecommendedRecipes } from "../../services/recipe.Service";
import { Recipe } from "../../types/recipe";
import { useAuth } from "@/context/AuthContext";

export default function RecommendedRecipesScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecommendedRecipes(user?.uid || "");
                setRecipes(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [user?.uid]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#ffd33d" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Recommended Recipes</Text>
            {recipes.map((recipe) => (
                <View key={recipe.recipe_id} style={styles.recipeCard}>
                    <TouchableOpacity onPress={() => router.push({ pathname: `/recipes/[id]`, params: { id: recipe.recipe_id } })}>
                        <Text style={styles.recipeTitle}>{recipe.recipe_name}</Text>
                        <Text style={styles.recipeDescription}>{recipe.recipe_description}</Text>
                        <Text style={styles.recipeTime}>⏱ {recipe.cooking_time} mins</Text>
                    </TouchableOpacity>

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffd33d",
        marginBottom: 15,
    },
    recipeCard: {
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    recipeDescription: {
        fontSize: 14,
        color: "#ccc",
        marginTop: 5,
    },
    recipeTime: {
        fontSize: 14,
        color: "#ffd33d",
        marginTop: 5,
    },
});