export interface Ingredient {
    ingredient_id: string;
    ingredient_name: string;
    quantity: number;
    unit: string;
  }
  
export interface Recipe {
    recipe_id: string;
    recipe_name: string;
    recipe_description: string;
    ingredients: Ingredient[];
    recipe_instructions: string;
    cooking_time: number;
    author_id: string;
  }