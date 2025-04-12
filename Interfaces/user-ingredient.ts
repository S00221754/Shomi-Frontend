export interface UserIngredientInput {
  userId: string;
  ingredientId: number;
  unitQuantity: number;
  totalAmount: number;
  unitType: string;
  expiry_date?: string | null;
}

export interface UserIngredientUpdate {
  unitQuantity?: number;
  totalAmount?: number;
  unitType: string;
  expiry_date?: string | null;
}
