export interface Ingredient {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface Author {
  id: string;
  full_name: string;
}

export interface Recipe {
  recipe_id: string;
  recipe_name: string;
  recipe_description: string;
  ingredients: Ingredient[];
  recipe_instructions: string;
  cooking_time: number;
  author: Author;
  recipe_images?: string[];
}

export interface RecipeDTO {
  recipe_name: string;
  recipe_description: string;
  ingredients: Ingredient[];
  recipe_instructions: string;
  cooking_time: number;
  author_id: string;
  recipe_images?: string[];
}

export interface DeductionPreview {
  recipe_ingredient: Ingredient;
  matched_user_ingredient: {
    id: string;
    ingredient_id: number;
    ingredient_name: string;
    unit: string;
  } | null;
  confidence_score: number;
  reason: string;
}

export interface IngredientsToDeduct {
  user_ingredient_id: string;
  recipe_quantity: number;
  recipe_unit: string;
}